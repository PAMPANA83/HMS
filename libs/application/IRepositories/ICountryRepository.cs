using HSMS.contracts.Dto;
using HSMS.Domain.Domains;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface ICountryRepository
    {

        Task<List<Countrytable>> GetAllAsync();

        Task<Countrytable?> GetByIdAsync(int id);

        Task<Countrytable> CreateAsync(Countrytable dto);

        Task<Countrytable> UpdateAsync(Countrytable dto);

        Task<Countrytable> DeleteAsync(Countrytable dto);
    }
}
