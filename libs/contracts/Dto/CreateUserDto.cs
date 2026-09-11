using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class CreateUserDto
    {
        public int companyId { get; set; }
        public int branchId { get; set; }
        public int departmentId { get; set; }
        public int roleId { get; set; }

        public string employeeCode { get; set; } = string.Empty;
        public string firstName { get; set; } = string.Empty;
        public string lastName { get; set; } = string.Empty;
        public string gender { get; set; } = string.Empty;

        public string dateOfBirth { get; set; } = string.Empty;

        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public string phone { get; set; } = string.Empty;
        public string emergencyContact { get; set; } = string.Empty;

        public string addressLine1 { get; set; } = string.Empty;

        public int cityId { get; set; }
        public int stateId { get; set; }
        public int countryId { get; set; }

        public string postalCode { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public string joinedDate { get; set; } = string.Empty;

        public string profileImageUrl { get; set; } = string.Empty;
    }
}
