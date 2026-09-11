using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class EmailRequest
    {
        public string? To { get; set; }
        public string? Name { get; set; }
        public string? Body { get; set; }
    }
}
