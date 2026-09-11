using HSMS.Application.IServices;
using HSMS.Application.Services;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountMasterController : ControllerBase
    {
        private readonly IAccountService _account;
        public AccountMasterController(IAccountService account)
        {
            _account = account;
           
        }

        [HttpGet("Login/{userLogin}/{password}")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(string userLogin, string password)
        {          

            var userResult = await _account.GetUserbyEmail(userLogin, password);
            if (userResult == null || !userResult.IsSuccess || userResult.Data == null)
            {
                return Unauthorized(userResult?.ErrorMessage);
            }

            var user = userResult.Data;
            return Ok(userResult); 
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            var token = Request.Headers["Authorization"]
               .ToString()
               .Replace("Bearer ", "");
            var expiry = User.FindFirst("exp")?.Value;           

            return Ok("Logged out successfully");
        }       
    }
    }
