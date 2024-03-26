using backend.Utils;

namespace backend.Middleware
{
    public class ExtractJWTMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public ExtractJWTMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Cookies["token"];

            if (!string.IsNullOrEmpty(token))
            {
                var (username, level) = JWT.DecodeJwtToken(token, _configuration);
                
                if (!string.IsNullOrEmpty(username))
                {
                    context.Items["Username"] = username;
                    context.Items["Level"] = level;
                }
            }

            await _next(context);
        }
    }

}