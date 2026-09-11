using HSMS.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolepermissionMasterController : ControllerBase
    {
        private readonly IRolePermissionService _services;

        public RolepermissionMasterController(IRolePermissionService services)
        {
            _services = services;
        }

        [HttpGet("ALLRolePermission")]
        public async Task<IActionResult> GetAllRollPermission()
        {
            var _res=await _services.GetAllRollPermission();
            if(!_res.IsSuccess)
            {
                return BadRequest(_res.IsSuccess);
            }

            return Ok(_res.Data);
        }



    }
}
