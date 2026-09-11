using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface IDepartmentsService
    {
        Task<Result<List<DepartmentDto>>> GetAllDepartmentAsync();
        Task<Result<DepartmentDto>> GetDepartmentAsync(int id);
        Task<Result<string>> DeleteDepartmentAsync(int id);
        Task<Result<String>> CreateDepartmentAsync(CreateDepartmentDto d);
        Task<Result<string>> UpdateDepartmentAsync(UpdateDepartmentDto d);

    }
}
