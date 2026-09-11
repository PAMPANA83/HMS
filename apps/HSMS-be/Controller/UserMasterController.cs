using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMasterController : ControllerBase
    {
        private readonly IUserMasterService _services;

        public UserMasterController(IUserMasterService services)
        {
            _services = services;
        }

        [HttpPost("CreateUser")]        
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var res = await _services.createUserAccount(dto);
            if(!res.IsSuccess)
            {
                return BadRequest(res.ErrorMessage);
            }

            return Ok(res.Data);
        }

        [HttpGet("AllUserDetails")]
        public async Task<IActionResult> GetUserDetailAsync()
        {
            var res = await _services.GetAllUsersAsync();
            if(!res.IsSuccess)
            {
                return BadRequest(res.ErrorMessage);
            }
            return Ok(res.Data);
        }

        [HttpGet("GetUserById/{id}")]
        public async Task<IActionResult> GetUserByIdAsync(int id)
        {
            var res = await _services.GetUserByID(id);
            if(!res.IsSuccess)
            {
                return BadRequest(res.ErrorMessage);
            }
            return Ok(res.Data);
        }
    }
}
