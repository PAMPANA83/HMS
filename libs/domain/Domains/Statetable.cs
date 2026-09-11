using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Statetable
    {
        public int? Id { get; set; }

        public int? CountryId { get; set; }
     
        public string? Name { get; set; } = string.Empty;

        public string? StateCode { get; set; }

        public DateTimeOffset? CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }

        public Statetable(int? id, int? countryId,  string? name, string? stateCode, DateTimeOffset? createdAt, DateTimeOffset? updatedAt)
        {
            Id = id;
            CountryId = countryId;           
            Name = name;
            StateCode = stateCode;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
}
