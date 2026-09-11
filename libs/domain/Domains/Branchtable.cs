using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Branchtable
    {
        public int? Id { get; set; }
        public int? CompanyId { get; set; }       
        public string? BranchName { get; set; } = string.Empty;
        public string? BranchCode { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? AddressLine1 { get; set; } = string.Empty;
        public string? AddressLine2 { get; set; }
        public int? CityId { get; set; }      
        public int? StateId { get; set; }      
        public int? CountryId { get; set; }       
        public string? PostalCode { get; set; }
        public bool? IsMainBranch { get; set; }
        public bool? IsActive { get; set; }
        public DateTimeOffset?  CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }

       public Branchtable(int? id, int? companyId, string? branchName, string? branchCode, string? email, string? phone, string? addressLine1, string? addressLine2, int? cityId, int? stateId, int? countryId, string? postalCode, bool? isMainBranch, bool? isActive, DateTimeOffset? createdAt, DateTimeOffset? updatedAt)
        {
            Id = id;
            CompanyId = companyId;
            BranchName = branchName;
            BranchCode = branchCode;
            Email = email;
            Phone = phone;
            AddressLine1 = addressLine1;
            AddressLine2 = addressLine2;
            CityId = cityId;
            StateId = stateId;
            CountryId = countryId;
            PostalCode = postalCode;
            IsMainBranch = isMainBranch;
            IsActive = isActive;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
}
