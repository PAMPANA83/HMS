using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Companytable
    {
        public int? Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string? RegistrationNumber { get; set; } = string.Empty;
        public string? Gstin { get; set; }
        public string? PanNumber { get; set; }
        public string? Email { get; set; } = string.Empty;
        public string? Phone { get; set; } = string.Empty;
        public string? Website { get; set; }
        public string? AddressLine1 { get; set; } = string.Empty;
        public string? AddressLine2 { get; set; }
        public int? CityId { get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; }        
        public string? PostalCode { get; set; }
        public bool? IsActive { get; set; }
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }

        public Companytable(int? id, string? name, string? registrationNumber, string? gstin, string? panNumber, string? email, string? phone, string? website, string? addressLine1, string? addressLine2, int? cityId, int? stateId, int? countryId, string? postalCode, bool? isActive, DateTimeOffset? createdAt, DateTimeOffset? updatedAt)
        {
            Id = id;
            Name = name;
            RegistrationNumber = registrationNumber;
            Gstin = gstin;
            PanNumber = panNumber;
            Email = email;
            Phone = phone;
            Website = website;
            AddressLine1 = addressLine1;
            AddressLine2 = addressLine2;
            CityId = cityId;
            StateId = stateId;
            CountryId = countryId;
            PostalCode = postalCode;
            IsActive = isActive;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
}
