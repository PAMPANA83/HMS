using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Roletable
    {
        public int? Id { get; set; }
        public int? CompanyId { get; set; }    
        public string? RoleCode { get; set; } = string.Empty;
        public string? RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool? IsSystemRole { get; set; }
        public bool? IsActive { get; set; }
        public DateTimeOffset? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }

        public Roletable(int? id, int? companyId,  string? roleCode, string? roleName, string? description, bool? isSystemRole, bool? isActive, DateTimeOffset? createdAt, int? createdBy, DateTimeOffset? updatedAt, int? updatedBy)
        {
            Id = id;
            CompanyId = companyId;            
            RoleCode = roleCode;
            RoleName = roleName;
            Description = description;
            IsSystemRole = isSystemRole;
            IsActive = isActive;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
            UpdatedAt = updatedAt;
            UpdatedBy = updatedBy;
        }
    }
}
