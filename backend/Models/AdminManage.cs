public class User
{
    public required string Username { get; set; }
    public string? Password { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Phone { get; set; }
    public required DateTime BirthDate { get; set; }
    public bool IsStaff { get; set; }
    public Position? Position { get; set; }
    public double? HourlyRate { get; set; }
    public string? Ssn { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Address { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }
    public bool? IsFullTime { get; set; }

}

public class Position
{
    public string? Name { get; set; }
    public int Level { get; set; }
}

public class ParkArea
{
    public string? Username { get; set; }
    public int AreaID { get; set; }
    public string? AreaName { get; set; }

}