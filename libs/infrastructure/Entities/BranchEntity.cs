using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace HSMS.infrastructure.Entities
{
    [Table("branches")]
    public class BranchEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        // Company
        [Required]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [ForeignKey(nameof(CompanyId))]
        public virtual CompanyEntity? Company { get; set; }

        // Branch Details
        [Required]
        [Column("branch_name")]
        [MaxLength(100)]
        public string BranchName { get; set; } = string.Empty;

        [Required]
        [Column("branch_code")]
        [MaxLength(20)]
        public string BranchCode { get; set; } = string.Empty;

        [Column("email")]
        [MaxLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        [Column("phone")]
        [MaxLength(20)]
        public string? Phone { get; set; }

        // Address
        [Required]
        [Column("address_line1")]
        [MaxLength(255)]
        public string AddressLine1 { get; set; } = string.Empty;

        [Column("address_line2")]
        [MaxLength(255)]
        public string? AddressLine2 { get; set; }

        // Location
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
        [Column("is_main_branch")]
        public bool? IsMainBranch { get; set; } = false;

        [Column("is_active")]
        public bool? IsActive { get; set; } = true;

        // Audit
        [Column("created_at")]
        public DateTimeOffset? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTimeOffset? UpdatedAt { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(CityId))]
        public virtual CityEntity? City { get; set; }

        [ForeignKey(nameof(StateId))]
        public virtual StateEntity? State { get; set; }

        [ForeignKey(nameof(CountryId))]
        public virtual CountryEntity? Country { get; set; }
    }
}
