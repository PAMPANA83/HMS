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
    public class RolePermissionRepository: IRolePermissionRepository
    {
        private readonly ApplicationDbContext _context;

        public RolePermissionRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;

        }

        public async Task<RolePermissiontable> CreateRolePermission(RolePermissiontable dto)
        {
            var res = new RolePermissionEntity
            {
                RoleId= (int)dto.roleID,
                PermissionId = (int)dto.PermissionId,
                GrantedAt = (DateTimeOffset)dto.GrantedAt,
                GrantedBy = dto.GrantedBy
            };
            await _context.rolePermissions.AddAsync(res);
            return dto;        
        }

        public async Task<List<RolePermissiontable>> GetAllAsync()
        {
            var res = await _context.rolePermissions.ToListAsync();
            if(res==null)
            {
                return null;
            }

            var _res = res.Select(x => new RolePermissiontable
            (x.RoleId,x.PermissionId,x.GrantedBy,x.GrantedAt)).ToList();

            return _res;
        }
    }
}
