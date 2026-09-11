using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class RolePermissionDto
    {
        public int RoleId { get; set; }
        public string? RoleCode { get; set; }
        public string? RoleName { get; set; }
        public int PermissionId { get; set; }
        public string? PermissionCode { get; set; }
        public string? ModuleName { get; set; }
        public string? Description { get; set; }
        public DateTimeOffset GrantedAt { get; set; }
        public int? GrantedBy { get; set; }
    }
}
