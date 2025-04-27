using System.ComponentModel.DataAnnotations;

namespace EcomMobile.API.Models
{
    public class Mobile
    {
        public int Id { get; set; }
        
        [Required]
        public string Brand { get; set; }
        
        [Required]
        public string Model { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        public string ImageUrl { get; set; }
        
        public string SelectedRAM { get; set; }
        public string SelectedStorage { get; set; }
        public string SelectedColor { get; set; }
        
        public MobileSpecs Specs { get; set; }
    }

    public class MobileSpecs
    {
        public string Display { get; set; }
        public string Processor { get; set; }
        public string Camera { get; set; }
        public string Battery { get; set; }
    }
} 