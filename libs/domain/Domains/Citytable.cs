using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Citytable
    {
        public int? Id { get; set; }

        public int? StateId { get; set; }    

        public string? Name { get; set; } = string.Empty;

        public string? PostalCode { get; set; }

        public DateTimeOffset? CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }

        public Citytable(int? id, int? stateId,  string? name, string? postalCode, DateTimeOffset? createdAt, DateTimeOffset? updatedAt)
        {
            Id = id;
            StateId = stateId;          
            Name = name;
            PostalCode = postalCode;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
}
