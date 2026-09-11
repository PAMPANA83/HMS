using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace HSMS.infrastructure.Entities
{
    [Table("users")]
    public class UserEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        // Organization
        [Required]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [Required]
        [Column("branch_id")]
        public int BranchId { get; set; }

        [Column("department_id")]
        public int? DepartmentId { get; set; }

        [Required]
        [Column("role_id")]
        public int RoleId { get; set; }

        // Employee Details
        [Required]
        [Column("employee_code")]
        [MaxLength(30)]
        public string EmployeeCode { get; set; } = string.Empty;

        [Required]
        [Column("first_name")]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [Column("last_name")]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Column("gender")]
        [MaxLength(10)]
        public string? Gender { get; set; }

        [Column("date_of_birth")]
        public DateTime? DateOfBirth { get; set; }

        // Login / Contact
        [Required]
        [Column("email")]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("password_hash")]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [Column("phone")]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Column("emergency_contact")]
        [MaxLength(20)]
        public string? EmergencyContact { get; set; }

        // Address
        [Column("address_line1")]
        [MaxLength(255)]
        public string? AddressLine1 { get; set; }

        [Column("city_id")]
        public int? CityId { get; set; }

        [Column("state_id")]
        public int? StateId { get; set; }

        [Column("country_id")]
        public int? CountryId { get; set; }

        [Column("postal_code")]
        [MaxLength(20)]
        public string? PostalCode { get; set; }

        // Status
        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("joined_date")]
        public DateTime JoinedDate { get; set; }

        // Audit
        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Column("updated_at")]
        public DateTimeOffset UpdatedAt { get; set; }

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        [Column("profile_image_url")]
        public string? ProfileImageUrl { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(CompanyId))]
        public virtual CompanyEntity? Company { get; set; }

        [ForeignKey(nameof(BranchId))]
        public virtual BranchEntity? Branch { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public virtual DepartmentEntity? Department { get; set; }

        [ForeignKey(nameof(RoleId))]
        public virtual RoleEntity? Role { get; set; }

        [ForeignKey(nameof(CityId))]
        public virtual CityEntity? City { get; set; }

        [ForeignKey(nameof(StateId))]
        public virtual StateEntity? State { get; set; }

        [ForeignKey(nameof(CountryId))]
        public virtual CountryEntity? Country { get; set; }

       
        public virtual UserEntity? CreatedByUser { get; set; }

        [ForeignKey(nameof(UpdatedBy))]
        public virtual UserEntity? UpdatedByUser { get; set; }
    }
}
