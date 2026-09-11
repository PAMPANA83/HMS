using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface IPatientRepository
    {
        Task<Patienttable> CreatePatientAsync(Patienttable dto);
        Task<Patienttable> UpdatePatientAsync(Patienttable dto);    
        Task<Patienttable> DeletePatientAsync(Patienttable dto);
        Task<List<Patienttable>> GetAllPatientTablesAsync();
        Task<Patienttable> GetPatientById(int Id);
        Task<Patienttable> GetPatientByName(string fristname, string lastnam);
    }
}
