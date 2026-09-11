using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Entities
{
    [Table("companies")]
    public class CompanyEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("registration_number")]
        [MaxLength(50)]
        public string RegistrationNumber { get; set; } = string.Empty;

        [Column("gstin")]
        [MaxLength(15)]
        public string? Gstin { get; set; }

        [Column("pan_number")]
        [MaxLength(10)]
        public string? PanNumber { get; set; }

        [Required]
        [Column("email")]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("phone")]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Column("website")]
        [MaxLength(150)]
        public string? Website { get; set; }

        [Required]
        [Column("address_line1")]
        [MaxLength(255)]
        public string AddressLine1 { get; set; } = string.Empty;

        [Column("address_line2")]
        [MaxLength(255)]
        public string? AddressLine2 { get; set; }

        [Column("city_id")]
        public int? CityId { get; set; }

        [Column("state_id")]
        public int? StateId { get; set; }

        [Column("country_id")]
        public int? CountryId { get; set; }

        [Column("postal_code")]
        [MaxLength(20)]
        public string? PostalCode { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTimeOffset UpdatedAt { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(CityId))]
        public virtual CityEntity? City { get; set; }

        [ForeignKey(nameof(StateId))]
        public virtual StateEntity? State { get; set; }

        [ForeignKey(nameof(CountryId))]
        public virtual CountryEntity? Country { get; set; }
    }
}
