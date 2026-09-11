using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
  
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentMasterController : ControllerBase
    {
        private readonly IDepartmentsService _service;
        public DepartmentMasterController(IDepartmentsService service)
        {
            _service = service;
        }
       
        [HttpGet("GetAllDepartment")]
        public async Task<IActionResult> GetAllDepartment()
        {
            var res = await _service.GetAllDepartmentAsync();
            if(!res.IsSuccess)
            {
                return BadRequest(res.ErrorMessage);
            }
            if(res.Data?.Count==0)
            {
                return NoContent();
            }

            return Ok(res.Data);

        }

        [HttpPost("createDepartment")]
        public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentDto dto)
        {
            var res = await _service.CreateDepartmentAsync(dto);
            if(!res.IsSuccess)
            {
                return BadRequest(res.ErrorMessage);
            }

            return Ok(res.Data);
        }

    }
}
