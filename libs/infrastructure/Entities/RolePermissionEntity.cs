using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Entities
{
    [Table("role_permissions")]
    public class RolePermissionEntity
    {
        [Required]
        [Key]
        [Column("role_id")]
        public int RoleId { get; set; }

        [Required]
        [Column("permission_id")]
        public int PermissionId { get; set; }

        [Column("granted_at")]
        public DateTimeOffset GrantedAt { get; set; }

        [Column("granted_by")]
        public int? GrantedBy { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(RoleId))]
        public virtual RoleEntity? Role { get; set; }

        [ForeignKey(nameof(PermissionId))]
        public virtual PermissionEntity? Permission { get; set; }
    }
}
