using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateMasterController : ControllerBase
    {
        private readonly IStateMasterService _stateMasterService;

        public StateMasterController(IStateMasterService stateMasterService)
        {
            _stateMasterService = stateMasterService;
        }

        [HttpGet("GetAllStateMasters")]
        public async Task<IActionResult> GetAllStateMasters()
        {
            var result = await _stateMasterService.GetAllStateMastersAysnc();
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }


        [HttpGet("GetStateMasterById/{id}")]
        public async Task<IActionResult> GetStateMasterById(int id)
        {
            var result = await _stateMasterService.GetStateMasterByIdAsync(id);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpPost("CreateStateMaster")]
        public async Task<IActionResult> CreateStateMaster([FromBody] CreateStateDto dto)
        {
            var result = await _stateMasterService.CreateStateMasterAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpDelete("DeleteStateMaster/{id}")]
        public async Task<IActionResult> DeleteStateMaster(int id)
        {
            var result = await _stateMasterService.DeleteStateMasterAsync(id);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        //[HttpPut("UpdateStateMaster")]
        //public async Task<IActionResult> UpdateStateMaster([FromBody] UpdateStateDto dto)
        //{
        //    var result = await _stateMasterService.u(dto);
        //    if (result.IsSuccess)
        //    {
        //        return Ok(result.Data);
        //    }
        //    else
        //    {
        //        return BadRequest(result.ErrorMessage);
        //    }
        //}
    }
}
