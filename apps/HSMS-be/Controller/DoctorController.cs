using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorServices _services;
        public DoctorController(IDoctorServices services)
        {
            _services = services;
        }

        [HttpGet("Doctordropdown")]
        public async Task<IActionResult> DoctorDropdown()
        {
            var res = await _services.GetAllDoctorDetails();
            if (res == null)
            {
                return BadRequest(res?.ErrorMessage);
            }

            return Ok(res.Data);
        }

        [HttpPost("RegisterDoctor")]
        public async Task<IActionResult> CreateDoctorAsync([FromBody] CreateDoctorDto dto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Please fill all required fields.",
                    errors = ModelState
                });
            }
            var res = await _services.CreateDocAsync(dto);
            if(res==null)
            {
                return BadRequest(res.ErrorMessage);
            }

            return Ok(res.Data);

        }

        [HttpGet("AllDoctor")]
        public async Task<IActionResult> GetAllDoctorDetails()
        {
            var res = await _services.GetDoctorsAllAsync();
            if(!res.IsSuccess )
            {
                if (res.Data?.Count == 0|| res.Data==null)
                {
                    return NotFound(res.ErrorMessage);
                }
                return BadRequest(res.ErrorMessage);
            }
           

            return Ok(res.Data);
        }

        [HttpGet("DoctorByID/{id}")]
        public async Task<IActionResult> GetDoctorbyID(int id)
        {
            var res = await _services.GetDoctorsAsync(id);
            if(!res.IsSuccess)
            {
                if(res.Data==null)
                {
                    return NotFound(res.ErrorMessage);
                }
                return BadRequest(res.ErrorMessage);
            }

            return Ok(res.Data);
        }

        [HttpPut("updateDoctor")]
        public async Task<IActionResult> UpdateDoctorAnyc([FromBody] UpdateDoctorDto dto)
        {
            var res = await _services.UpdateDocbyId(dto);
            if (!res.IsSuccess)
            {
                if (res.Data == null)
                {
                    return NotFound(res.ErrorMessage);
                }
                return BadRequest(res.ErrorMessage);
            }

            return Ok(res.Data);
        }

        [HttpGet("DeleteDoctorByID/{id}")]
        public async Task<IActionResult> DeleteDoctorbyId(int Id)
        {
            var res = await _services.DeleteDoctorbyId(Id);
            if (!res.IsSuccess)
            {
                if (res.Data == null)
                {
                    return NotFound(res.ErrorMessage);
                }
                return BadRequest(res.ErrorMessage);
            }

            return Ok(res.Data);
        }

        [HttpGet("DoctorRegdropdown")]
        public async Task<IActionResult> DoctorResDropdown()
        {
            var res = await _services.GetAllDoctorsDetails();
            if (res == null)
            {
                return BadRequest(res?.ErrorMessage);
            }

            return Ok(res.Data);
        }
    }
}
