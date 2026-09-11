using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {

        private readonly IAppointmentService _service;

        public AppointmentController(IAppointmentService service)
        {
            _service = service;
        }

        [HttpGet("GetAllAppointment")]
        public async Task<IActionResult> GetAllAppointment()
        {
            var res = await _service.GetallAppointment();
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

        [HttpGet("getAppointmentbyPatientID/{ID}")]
        public async Task<IActionResult> GetAllAppointmentById(int ID)
        {
            var res = await _service.getAllAppointmentByPatientIdAsync(ID);
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

        [HttpPost("CreateAppointment")]
        public async Task<IActionResult> CreateAppointmentAsync([FromBody] CreateAppointmentDto dto)
        {

            var res = await _service.createAppointmentAsync(dto);
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

        [HttpPut("UpdateAppointment")]
        public async Task<IActionResult> UpdateStatusAppointmentAsync([FromBody] UpdateStatusAppointment dto)
        {
            var res = await _service.updateStatusAppointmentAsync(dto);
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
