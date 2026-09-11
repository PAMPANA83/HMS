using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UserDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public int BranchId { get; set; }
        public string? BranchName { get; set; }
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
        public string? RoleCode { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName =>
            $"{FirstName} {LastName}".Trim();
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? EmergencyContact { get; set; }
        public string? AddressLine1 { get; set; }
        public int? CityId { get; set; }
        public string? CityName { get; set; }
        public int? StateId { get; set; }
        public string? StateName { get; set; }
        public int? CountryId { get; set; }
        public string? CountryName { get; set; }
        public string? PostalCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime JoinedDate { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string? CreatedOn { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
       public string? profileImageUrl { get; set; }
       public string? PasswordHash { get; set; }
    }
}
