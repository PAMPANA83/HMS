using HSMS.Application.IRepositories;
using HSMS.Domain.Domains;
using HSMS.infrastructure.Entities;
using HSMS.infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Repositories
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly ApplicationDbContext _context;
        public PermissionRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }
        public async Task<Permissiontable> createPermission(Permissiontable dto)
        {
            var res = new PermissionEntity
            {
                PermissionCode = dto.PermissionCode,
                ModuleName = dto.ModuleName,
                Description = dto.Description,
                CreatedAt = (DateTimeOffset)dto.CreatedAt
            };
            await _context.PermissionMasters.AddAsync(res);

            return dto;

        }

        public async Task<List<Permissiontable>> GetAllPermissionAsyc()
        {
            var res = await _context.PermissionMasters.ToListAsync();
            if(res==null)
            {
                return null;
            }
            var _res = res.Select(x => new Permissiontable(x.Id, x.PermissionCode, x.ModuleName, x.Description,
                x.CreatedAt)).ToList();
            return _res;
        }
    }
}
