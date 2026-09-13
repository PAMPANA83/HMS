using HSMS.contracts.Dto;
using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface IDoctorRespository
    {
        Task<List<Doctorstable>> GetAllAsync();
        Task<Doctorstable?> GetByIdAsync(int id);
        Task<Doctorstable?> AddAsync(Doctorstable doc);
        Task<Doctorstable> UpdateAsync(Doctorstable doc);
        Task<Doctorstable> DeleteAsync(Doctorstable doctor);
        Task DeleteAsync(DoctorDto? res);
        Task<Doctorstable?> GetByPatientIDAsync(int id);
    }
}
