using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientServices _services;

        public PatientsController(IPatientServices services)
        {
            _services = services;
        }

        [HttpGet("AllPatientsrecord")]
        public async Task<IActionResult> GetAllPatientAsync()
        {
            var res = await _services.GetAllPatientAsync();
            if (!res.IsSuccess)
            {
                if (res.Data == null|| res.Data?.Count == 0)
                {
                    return NotFound("No record found");
                }
                return BadRequest(res.ErrorMessage);
            }
            return Ok(res.Data);
        }

        [HttpGet("GetPatientbyId/{Id}")]
        public async Task<IActionResult> GetPatientById(int Id)
        {
            var res = await _services.GetPatientById(Id);
            if (!res.IsSuccess)
            {
                if (res.Data == null)
                {
                    return NotFound("No Record Found");
                }
                return BadRequest(res.ErrorMessage);
            }
            return Ok(res.Data);
        }

        [HttpPost("Createpatients")]
        public async Task<IActionResult> CreatePatientAsync(CreatePatientDto dto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var res = await _services.CreatePatientAsync(dto);
            if (!res.IsSuccess)
            {
                if (res.Data == null)
                {
                    return NoContent();
                }
                return BadRequest(res.ErrorMessage);
            }

            return Ok(res.Data);
        }

        [HttpDelete("DeleteById/{id}")]
        public async Task<IActionResult> DeletePatientbyId(int id)
        {
            var res = await _services.DeletePatientAsync(id);
            if (!res.IsSuccess)
            {
                if (res.Data == null)
                {
                    return NoContent();
                }
                return BadRequest(res.ErrorMessage);
            }
            return Ok(res.Data);
        }

        [HttpPut("UpdatePatients")]
        public async Task<IActionResult> UpdatePatientsAsync([FromBody] UpdatePatientDto dto)
        {

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var res = await _services.UpdatePatientAsync(dto);
            if (!res.IsSuccess)
            {
                if (res.Data == null)
                {
                    return NoContent();
                }
                return BadRequest(res.ErrorMessage);
            }
            return Ok(res.Data);
        }

        [HttpGet("patientDropdown")]
        public async Task<IActionResult> Patientdropdown()
        {
            var res = await _services.GetAllPatientDropdown();
            if (!res.IsSuccess)
            {
                if (res.Data == null)
                {
                    return NoContent();
                }
                return BadRequest(res.ErrorMessage);
            }
            return Ok(res.Data);
        }
    }
}
