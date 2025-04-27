using System.ComponentModel.DataAnnotations;

namespace EcomMobile.API.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
        
        [Required]
        public string Name { get; set; }
        
        public string Phone { get; set; }
        
        public List<Address> Addresses { get; set; } = new List<Address>();
    }

    public class Address
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; }
        
        [Required]
        public string AddressLine { get; set; }
        
        [Required]
        public string Phone { get; set; }
        
        public string Type { get; set; }
        
        public bool IsDefault { get; set; }
    }
} 