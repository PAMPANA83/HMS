using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface IStateRepositories
    {
        Task<List<Statetable>> GetAllAsync();
        Task<Statetable?> GetByIdAsync(int id);
        Task<Statetable> CreateAsync(Statetable dto);
        Task<Statetable> UpdateAsync(Statetable dto);
        Task<Statetable> DeleteAsync(Statetable dto);
    }

}
