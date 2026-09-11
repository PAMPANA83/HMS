using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class CountryDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string IsoCode { get; set; } = string.Empty;

        public string PhoneCode { get; set; } = string.Empty;

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset UpdatedAt { get; set; }
    }
}
