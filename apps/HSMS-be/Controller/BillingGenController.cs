using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillingGenController : ControllerBase
    {
        private readonly IBillingService _billingService;

        public BillingGenController(IBillingService billingService)
        {
            _billingService = billingService;
        }

        [HttpPost("create-billing")]
        public async Task<IActionResult> CreateBilling([FromBody] CreateBillingDto dto)
        {
            var result = await _billingService.CreateAsync(dto);
            if ( !result.IsSuccess && !string.IsNullOrEmpty(result.ErrorMessage))
            {
                return BadRequest(result.ErrorMessage);
            }
            return Ok(result.Data);
        }

        [HttpGet("get-all-billing")]
        public async Task<IActionResult> GetAllBilling()
        {
            var result = await _billingService.GetAllBillingAsync();
            if (!result.IsSuccess && !string.IsNullOrEmpty(result.ErrorMessage))
            {
                return BadRequest(result.ErrorMessage);
            }
            return Ok(result.Data);
        }

    }
}
