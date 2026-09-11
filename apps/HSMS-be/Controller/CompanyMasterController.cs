using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyMasterController : ControllerBase
    {
        private readonly ICompanyService _companyMasterService;
        public CompanyMasterController(ICompanyService companyMasterService)
        {
            _companyMasterService = companyMasterService;
        }
        [HttpGet("GetAllCompanyMasters")]
        public async Task<IActionResult> GetAllCompanyMasters()
        {
            var result = await _companyMasterService.GetAllCompanyMastersAysnc();
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }
        [HttpGet("GetCompanyMasterById/{id}")]
        public async Task<IActionResult> GetCompanyMasterById(int id)
        {
            var result = await _companyMasterService.GetCompanyMasterByIdAsync(id);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }
        [HttpPost("CreateCompanyMaster")]
        public async Task<IActionResult> CreateCompanyMaster([FromBody] CreateCompanyDto dto)
        {
            var result = await _companyMasterService.CreateCompanyMasterAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpPut("UpdateCompanyMaster")]
        public async Task<IActionResult> UpdateCompanyMaster([FromBody] UpdateCompanyDto dto)
        {
            var result = await _companyMasterService.UpdateCompanyMasterAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpDelete("DeleteCompanyMaster/{id}")]
        public async Task<IActionResult> DeleteCompanyMaster(int id)
        {
            var result = await _companyMasterService.DeleteCompanyMasterAsync(id);
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
