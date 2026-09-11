using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface IBranchMasterService
    {
        Task<Result<List<BranchDto>>> GetAllBranchMastersAysnc();
        Task<Result<BranchDto>> GetBranchMasterByIdAsync(int id);
        Task<Result<string>> CreateBranchMasterAsync(CreateBranchDto dto);
        Task<Result<string>> UpdateBranchMasterAsync(UpdateBranchDto dto);
        Task<Result<string>> DeleteBranchMasterAsync(int id);
    }
}
