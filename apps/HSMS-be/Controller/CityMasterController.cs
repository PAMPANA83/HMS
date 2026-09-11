using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
   
    [Route("api/[controller]")]
    [ApiController]
 
    public class CityMasterController : ControllerBase
    {
        private readonly ICityMasterService _cityMasterService;
        public CityMasterController(ICityMasterService cityMasterService)
        {
            _cityMasterService = cityMasterService;
        }
        [HttpGet("GetAllCityMasters")]
        public async Task<IActionResult> GetAllCityMasters()
        {
            var result = await _cityMasterService.GetAllCityMastersAysnc();
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpGet("GetCityMasterById/{id}")]
        public async Task<IActionResult> GetCityMasterById(int id)
        {
            var result = await _cityMasterService.GetCityMasterByIdAsync(id);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpPost("CreateCityMaster")]
        public async Task<IActionResult> CreateCityMaster([FromBody] CreateCityDto dto)
        {
            var result = await _cityMasterService.CreateCityMasterAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpPut("UpdateCityMaster")]
        public async Task<IActionResult> UpdateCityMaster([FromBody] UpdateCityDto dto)
        {
            var result = await _cityMasterService.UpdateCityMasterAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpDelete("DeleteCityMaster/{id}")]
        public async Task<IActionResult> DeleteCityMaster(int id)
        {
            var result = await _cityMasterService.DeleteCityMasterAsync(id);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        

    }
}
