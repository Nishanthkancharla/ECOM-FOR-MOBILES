using EcomMobile.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcomMobile.API.Services
{
    public interface IMobileService
    {
        Task<List<Mobile>> GetAllMobilesAsync();
        Task<Mobile> GetMobileByIdAsync(int id);
        Task<Mobile> AddMobileAsync(Mobile mobile);
        Task<Mobile> UpdateMobileAsync(int id, Mobile mobile);
        Task DeleteMobileAsync(int id);
    }
} 