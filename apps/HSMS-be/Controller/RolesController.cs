using HSMS.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleMasterService _Service;

        public RolesController(IRoleMasterService service)
        {
            _Service = service;
        }

        [HttpGet("GetAllrole")]
        public async Task<IActionResult> GetAllRoles()
        {
           var res=await _Service.GetAllRoles();
            if(!res.IsSuccess)
            {
                return BadRequest(res.ErrorMessage);
            }

            return Ok(res.Data);
        }

    }
}
