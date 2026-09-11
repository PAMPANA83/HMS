using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
   
public class Usertable
    {
        public int? Id { get; set; }
        public int CompanyId { get; set; }
        public int BranchId { get; set; }
        public int? DepartmentId { get; set; }
        public int RoleId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? EmergencyContact { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? AddressLine1 { get; set; }
        public int? CityId { get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; }
        public string? PostalCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime JoinedDate { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }

        public string? PasswordHash { get; set; }


        public Usertable(
            int? id,
            int companyId,
            int branchId,
            int? departmentId,
            int roleId,
            string employeeCode,
            string firstName,
            string lastName,
            string? gender,
            DateTime? dateOfBirth,
            string email,
            string phone,
            string? emergencyContact,
            string? profileImageUrl,
            string? addressLine1,
            int? cityId,
            int? stateId,
            int? countryId,
            string? postalCode,
            bool isActive,
            DateTime joinedDate,
            DateTimeOffset createdAt,
            int? createdBy,
            DateTimeOffset? updatedAt,
            int? updatedBy,
            string? passwordHash)
        {
            Id = id;
            CompanyId = companyId;
            BranchId = branchId;
            DepartmentId = departmentId;
            RoleId = roleId;
            EmployeeCode = employeeCode;
            FirstName = firstName;
            LastName = lastName;
            Gender = gender;
            DateOfBirth = dateOfBirth;
            Email = email;
            Phone = phone;
            EmergencyContact = emergencyContact;
            ProfileImageUrl = profileImageUrl;
            AddressLine1 = addressLine1;
            CityId = cityId;
            StateId = stateId;
            CountryId = countryId;
            PostalCode = postalCode;
            IsActive = isActive;
            JoinedDate = joinedDate;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
            UpdatedAt = updatedAt;
            UpdatedBy = updatedBy;
            PasswordHash = passwordHash;
        }
    }

}
