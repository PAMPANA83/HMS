using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class CountryMasterController : ControllerBase
    {
        private readonly CountryMasterIService _service;

        public CountryMasterController(CountryMasterIService service)
        {
            _service = service;
        }
        [HttpPost("NewCountry")]
        public async Task<IActionResult> CreateCountry([FromBody] CountryMastersDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.CreateCountryMasterAysnc(dto);
            if (!result.IsSuccess)
            {
                return BadRequest(new { result.ErrorMessage });
            }
            return Ok(result.Data);
        }

        [HttpGet("GetAllRecord")]
        public async Task<IActionResult> GetAllcountryAsync()
        {
            var res = await _service.GetAllCountryMastersAysnc();
            if (!res.IsSuccess)
            {
                return BadRequest(new { res.ErrorMessage });
            }
            return Ok(res.Data);
        }
        [HttpDelete("DeleteCountryId/{id}")]
        public async Task<IActionResult> DeleteCountryAsync(int id)
        {
            var res = await _service.DeleteCountryMasterAsync(id);
            if (!res.IsSuccess)
            {
                return BadRequest(new { res.ErrorMessage });
            }
            return Ok(res.Data);
        }
    }
}
