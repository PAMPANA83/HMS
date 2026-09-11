using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class BranchMasterController : ControllerBase
    {
        private readonly IBranchMasterService _branchMasterService;
        public BranchMasterController(IBranchMasterService branchMasterService)
        {
            _branchMasterService = branchMasterService;
        }
        [HttpGet("GetAllBranchMasters")]
        public async Task<IActionResult> GetAllBranchMasters()
        {
            var result = await _branchMasterService.GetAllBranchMastersAysnc();
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }
        [HttpGet("GetBranchMasterById/{id}")]
        public async Task<IActionResult> GetBranchMasterById(int id)
        {
            var result = await _branchMasterService.GetBranchMasterByIdAsync(id);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }
        [HttpPost("CreateBranchMaster")]
        public async Task<IActionResult> CreateBranchMaster([FromBody] CreateBranchDto dto)
        {
            var result = await _branchMasterService.CreateBranchMasterAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpPut("UpdateBranchMaster")]
        public async Task<IActionResult> UpdateBranchMaster([FromBody] UpdateBranchDto dto)
        {
            var result = await _branchMasterService.UpdateBranchMasterAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }

        [HttpDelete("DeleteBranchMaster/{id}")]
        public async Task<IActionResult> DeleteBranchMaster(int id)
        {
            var result = await _branchMasterService.DeleteBranchMasterAsync(id);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.ErrorMessage);
            }
        }
    }
}
