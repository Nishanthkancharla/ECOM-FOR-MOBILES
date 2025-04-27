using Microsoft.AspNetCore.Mvc;
using EcomMobile.API.Services;
using EcomMobile.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcomMobile.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MobilesController : ControllerBase
    {
        private readonly IMobileService _mobileService;

        public MobilesController(IMobileService mobileService)
        {
            _mobileService = mobileService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mobile>>> GetMobiles()
        {
            var mobiles = await _mobileService.GetAllMobilesAsync();
            return Ok(mobiles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Mobile>> GetMobile(int id)
        {
            var mobile = await _mobileService.GetMobileByIdAsync(id);
            if (mobile == null)
                return NotFound();

            return Ok(mobile);
        }

        [HttpPost]
        public async Task<ActionResult<Mobile>> CreateMobile(Mobile mobile)
        {
            var createdMobile = await _mobileService.AddMobileAsync(mobile);
            return CreatedAtAction(nameof(GetMobile), new { id = createdMobile.Id }, createdMobile);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMobile(int id, Mobile mobile)
        {
            var updatedMobile = await _mobileService.UpdateMobileAsync(id, mobile);
            if (updatedMobile == null)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMobile(int id)
        {
            await _mobileService.DeleteMobileAsync(id);
            return NoContent();
        }
    }
} 