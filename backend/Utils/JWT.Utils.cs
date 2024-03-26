using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Utils
{
    public static class JWT
    {
        public static string GenerateToken(string username, int level, IConfiguration configuration)
        {
            var secret = configuration["JwtSecret"];
            Console.WriteLine($"JwtSecret value: {secret}");
            var key = Encoding.ASCII.GetBytes(secret ?? string.Empty);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, level.ToString())
                }),
                Expires = DateTime.UtcNow.AddYears(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static (string? Username, int Level) DecodeJwtToken(string token, IConfiguration configuration)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var secret = configuration.GetValue<string>("JwtSecret");
            var key = Encoding.ASCII.GetBytes(secret ?? string.Empty);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var username = jwtToken.Claims.FirstOrDefault(x => x.Type == "unique_name")?.Value;
            var level = int.Parse(jwtToken.Claims.FirstOrDefault(x => x.Type == "role")?.Value ?? "0");

            return (username, level);
        }
    }
}
