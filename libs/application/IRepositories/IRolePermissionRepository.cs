using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface IRolePermissionRepository
    {
        Task<List<RolePermissiontable>> GetAllAsync();
        Task<RolePermissiontable> CreateRolePermission(RolePermissiontable dto);
    }
}
