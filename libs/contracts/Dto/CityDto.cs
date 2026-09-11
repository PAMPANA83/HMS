using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class CityDto
    {
        public int Id { get; set; }

        public int StateId { get; set; }

        public string StateName { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string? PostalCode { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }
    }
}
