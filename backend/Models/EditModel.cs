namespace backend.Models
{
    public class UserModel
    {
        public required string Password { get; set; }
        public required string First_name { get; set; }
        public required string Last_name { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
    }
}