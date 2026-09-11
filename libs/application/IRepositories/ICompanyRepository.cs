using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface ICompanyRepository
    {
        Task<List<Companytable>> GetAllAsync();
        Task<Companytable?> GetByIdAsync(int id);
        Task<Companytable> CreateAsync(Companytable dto);
        Task<Companytable> UpdateAsync(Companytable dto);
        Task<Companytable> DeleteAsync(Companytable dto);
    }
}
