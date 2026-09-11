using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdateBranchDto
    {
        [Required]
        public int Id { get; set; }
        [Required(ErrorMessage = "Branch name is required.")]
        [MaxLength(100)]
        public string BranchName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Branch code is required.")]
        [MaxLength(20)]
        public string BranchCode { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        [MaxLength(255)]
        public string AddressLine1 { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? AddressLine2 { get; set; }

        public int? CityId { get; set; }

        public int? StateId { get; set; }

        public int? CountryId { get; set; }

        [MaxLength(20)]
        public string? PostalCode { get; set; }

        public bool IsMainBranch { get; set; }

        public bool IsActive { get; set; }
    }
}
