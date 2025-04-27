using EcomMobile.API.Data;
using EcomMobile.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcomMobile.API.Services
{
    public class MobileService : IMobileService
    {
        private readonly ApplicationDbContext _context;

        public MobileService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Mobile>> GetAllMobilesAsync()
        {
            return await _context.Mobiles.ToListAsync();
        }

        public async Task<Mobile> GetMobileByIdAsync(int id)
        {
            return await _context.Mobiles.FindAsync(id);
        }

        public async Task<Mobile> AddMobileAsync(Mobile mobile)
        {
            _context.Mobiles.Add(mobile);
            await _context.SaveChangesAsync();
            return mobile;
        }

        public async Task<Mobile> UpdateMobileAsync(int id, Mobile mobile)
        {
            var existingMobile = await _context.Mobiles.FindAsync(id);
            if (existingMobile == null)
                return null;

            existingMobile.Brand = mobile.Brand;
            existingMobile.Model = mobile.Model;
            existingMobile.Price = mobile.Price;
            existingMobile.ImageUrl = mobile.ImageUrl;
            existingMobile.SelectedRAM = mobile.SelectedRAM;
            existingMobile.SelectedStorage = mobile.SelectedStorage;
            existingMobile.SelectedColor = mobile.SelectedColor;
            existingMobile.Specs = mobile.Specs;

            await _context.SaveChangesAsync();
            return existingMobile;
        }

        public async Task DeleteMobileAsync(int id)
        {
            var mobile = await _context.Mobiles.FindAsync(id);
            if (mobile != null)
            {
                _context.Mobiles.Remove(mobile);
                await _context.SaveChangesAsync();
            }
        }
    }
} 