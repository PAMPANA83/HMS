using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface IPermissionService
    {
        Task<Result<List<PermissionDto>>> GetAllPermissionAnysc();
        Task<Result<string>> CreatePermission(CreatePermissionDto dto);
    }
}
