using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Entities
{
    [Table("doctors")]
    public class DoctorEntity
    {
        [Key]      
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("branch_id")]
        public int BranchId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("department_id")]
        public int? DepartmentId { get; set; }

        [StringLength(100)]
        [Column("specialization")]
        public string? Specialization { get; set; }

        [StringLength(50)]
        [Column("license_number")]
        public string? LicenseNumber { get; set; }

        [Column("consultation_fee", TypeName = "decimal(18, 2)")]
        public decimal? ConsultationFee { get; set; }

        [Required]
        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTimeOffset? CreatedAt { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Column("updated_at")]
        public DateTimeOffset? UpdatedAt { get; set; }

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(BranchId))]
        public virtual BranchEntity Branch { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public virtual UserEntity User { get; set; } = null!;

        [ForeignKey(nameof(DepartmentId))]
        public virtual DepartmentEntity? Department { get; set; }
    }
}
