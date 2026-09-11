using HSMS.contracts.Dto;
using HSMS.Domain.Domains;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface IDoctorServices
    {
        Task<Result<List<DoctorDto>>> GetDoctorsAllAsync();
        Task<Result<DoctorDto>> GetDoctorsAsync(int Id);
        Task<Result<string>> CreateDocAsync(CreateDoctorDto dto);
        Task<Result<List<DoctorDropdown>>> GetAllDoctorDetails();
        Task<Result<string>> UpdateDocbyId(UpdateDoctorDto dto);
        Task<Result<string>> DeleteDoctorbyId(int Id);
        Task<Result<List<DoctorDropdown>>> GetAllDoctorsDetails();

    }
}
