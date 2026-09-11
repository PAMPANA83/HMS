using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface ICityRepository
    {
        Task<List<Citytable>> GetAllAsync();
        Task<Citytable?> GetByIdAsync(int id);
        Task<Citytable> CreateAsync(Citytable dto);
        Task<Citytable> UpdateAsync(Citytable dto);
        Task<Citytable> DeleteAsync(Citytable dto);
    }
}
