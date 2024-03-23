namespace backend.Models
{
    public class RegisterModel {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string First_name { get; set; }
        public required string Last_name { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
    }


    public class LoginModel
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
