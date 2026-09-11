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
    public interface IRoleRepository
    {
        Task<List<Roletable>> getALlRoleAsync();
        Task<Roletable> GetRoleById(int id);
    }
}
