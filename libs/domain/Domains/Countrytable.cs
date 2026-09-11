using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Countrytable
    {
        public int? Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string? IsoCode { get; set; } = string.Empty;
        public string? PhoneCode { get; set; } = string.Empty;
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
       
        public Countrytable(int? id,string? name,string? isoCode,string? phoneCode,DateTimeOffset? createdAt,DateTimeOffset? updatedAt)
        {
            Id = id;
            Name = name;
            IsoCode = isoCode;
            PhoneCode = phoneCode;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
}
