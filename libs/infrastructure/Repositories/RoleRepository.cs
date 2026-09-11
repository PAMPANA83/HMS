using HSMS.Application.IRepositories;
using HSMS.Domain.Domains;
using HSMS.infrastructure.Persistence;
using HSMS.shared.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;
        public RoleRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }

        public async Task<List<Roletable>> getALlRoleAsync()
        {
            var _res = await _context.RoleMasters.ToListAsync();
            if(_res==null)
            {
                return null;
            }
            else
            {
                var res = _res.Select(x => new Roletable(x.Id, x.CompanyId, x.RoleCode, x.RoleName, x.Description,
                    x.IsSystemRole, x.IsActive, x.CreatedAt, x.CreatedBy, x.UpdatedAt, x.UpdatedBy)).ToList();
                return res;
            }
        }

        public async Task<Roletable> GetRoleById(int id)
        {
            var res = await _context.RoleMasters.FirstOrDefaultAsync(x => x.Id == id);
            if(res==null)
            {
                return null;
            }
            else
            {
               var _res=new Roletable(res.Id,res.CompanyId,res.RoleCode,res.RoleName,res.Description,
                   res.IsSystemRole, res.IsActive, res.CreatedAt, res.CreatedBy,res.UpdatedAt, res.UpdatedBy);
                return _res;
            }
        }
    }
}
