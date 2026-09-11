using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Permissiontable
    {
        public int? Id { get; set; }

        public string? PermissionCode { get; set; } = string.Empty;

        public string? ModuleName { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTimeOffset? CreatedAt { get; set; }


        public Permissiontable(int? id, string? permissionCode, string? moduleName, string? description, DateTimeOffset? createdAt)
        {
            Id = id;
            PermissionCode = permissionCode;
            ModuleName = moduleName;
            Description = description;
            CreatedAt = createdAt;
        }
    }
}
