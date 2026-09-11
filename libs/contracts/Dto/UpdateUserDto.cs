using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdateUserDto
    {
        [Required(ErrorMessage = "Branch is required.")]
        public int BranchId { get; set; }
        public int? DepartmentId { get; set; }
        [Required(ErrorMessage = "Role is required.")]
        public int RoleId { get; set; }

        [Required(ErrorMessage = "First name is required.")]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [RegularExpression(
            "^(MALE|FEMALE|OTHER)$",
            ErrorMessage = "Gender must be MALE, FEMALE or OTHER.")]
        public string? Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required.")]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? EmergencyContact { get; set; }

        [MaxLength(255)]
        public string? AddressLine1 { get; set; }

        public int? CityId { get; set; }

        public int? StateId { get; set; }

        public int? CountryId { get; set; }

        [MaxLength(20)]
        public string? PostalCode { get; set; }

        public bool IsActive { get; set; }
    }
}
