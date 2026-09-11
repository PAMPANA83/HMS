using HSMS.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionMasterController : ControllerBase
    {
        private readonly IPermissionService _service;

        public PermissionMasterController(IPermissionService service)
        {
            _service = service;
        }

        [HttpGet("GetALLRecordPermission")]
        public async Task<IActionResult> GetAllPermission()
        {
            var res = await _service.GetAllPermissionAnysc();
            if(!res.IsSuccess)
            {
                return BadRequest(res.ErrorMessage);
            }
            return Ok(res.Data);
        }

    }
}
