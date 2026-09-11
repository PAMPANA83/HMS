using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class RolePermissiontable
    {
        public object roleID;

        public int? RoleId { get; set; }
        public int?  PermissionId { get; set; }
        public DateTimeOffset? GrantedAt { get; set; }
        public int? GrantedBy { get; set; }

        public RolePermissiontable(int? roleId, int? permissionid, DateTimeOffset? grantedAt,int? grantedBy)
        {
            RoleId = roleId;
            PermissionId = permissionid;
            GrantedAt = grantedAt;
            GrantedBy = grantedBy;

        }

        public RolePermissiontable(int roleId, int permissionId, int? grantedBy, DateTimeOffset grantedAt)
        {
            RoleId = roleId;
            PermissionId = permissionId;
            GrantedBy = grantedBy;
            GrantedAt = grantedAt;
        }
    }
}
