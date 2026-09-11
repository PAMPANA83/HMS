using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface IPatientServices
    {
        Task<Result<List<PatientDto>>> GetAllPatientAsync();
        Task<Result<string>> CreatePatientAsync(CreatePatientDto dto);
        Task<Result<PatientDto>> GetPatientById(int Id);
        Task<Result<string>> UpdatePatientAsync(UpdatePatientDto dto);
        Task<Result<string>> DeletePatientAsync(int Id);

        Task<Result<List<PatientDropdown>>> GetAllPatientDropdown();
    }
}
