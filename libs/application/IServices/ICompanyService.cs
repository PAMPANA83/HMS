using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface ICompanyService
    {
        Task<Result<List<CompanyDto>>> GetAllCompanyMastersAysnc();
        Task<Result<CompanyDto>> GetCompanyMasterByIdAsync(int id);
        Task<Result<string>> CreateCompanyMasterAsync(CreateCompanyDto dto);
        Task<Result<CompanyDto>> UpdateCompanyMasterAsync(UpdateCompanyDto dto);
        Task<Result<string>> DeleteCompanyMasterAsync(int id);
    }
}
