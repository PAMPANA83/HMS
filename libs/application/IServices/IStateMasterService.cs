using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface IStateMasterService
    {
        Task<Result<List<StateDto>>> GetAllStateMastersAysnc();
        Task<Result<StateDto>> GetStateMasterByIdAsync(int id);
        Task<Result<string>> CreateStateMasterAsync(CreateStateDto dto);
      //  Task<Result<string>> UpdateStateMasterAsync(up dto);
        Task<Result<string>> DeleteStateMasterAsync(int id);
    }
}
