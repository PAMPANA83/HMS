using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface IBranchRepository
    {
        Task<List<Branchtable>> GetAllAsync();
        Task<Branchtable?> GetByIdAsync(int id);
        Task<Branchtable> CreateAsync(Branchtable dto);
        Task<Branchtable> UpdateAsync(Branchtable dto);
        Task<Branchtable> DeleteAsync(Branchtable dto);
    }
}
