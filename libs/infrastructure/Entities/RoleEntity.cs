using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace HSMS.infrastructure.Entities
{
    [Table("roles")]
    public class RoleEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("company_id")]
        public int? CompanyId { get; set; }

        [Required]
        [Column("role_code")]
        [MaxLength(50)]
        public string RoleCode { get; set; } = string.Empty;

        [Required]
        [Column("role_name")]
        [MaxLength(100)]
        public string RoleName { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("is_system_role")]
        public bool IsSystemRole { get; set; } = false;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Column("updated_at")]
        public DateTimeOffset UpdatedAt { get; set; }

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        // Navigation Property
        [ForeignKey(nameof(CompanyId))]
        public virtual CompanyEntity? Company { get; set; }
    }
}
