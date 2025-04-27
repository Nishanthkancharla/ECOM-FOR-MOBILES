using System.ComponentModel.DataAnnotations;

namespace EcomMobile.API.Models
{
    public class Order
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int AddressId { get; set; }
        
        [Required]
        public decimal TotalAmount { get; set; }
        
        [Required]
        public string PaymentMethod { get; set; }
        
        public string PaymentStatus { get; set; }
        
        public string OrderStatus { get; set; }
        
        public DateTime OrderDate { get; set; }
        
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        
        [Required]
        public int OrderId { get; set; }
        
        [Required]
        public int MobileId { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        public string SelectedRAM { get; set; }
        public string SelectedStorage { get; set; }
        public string SelectedColor { get; set; }
    }
} 