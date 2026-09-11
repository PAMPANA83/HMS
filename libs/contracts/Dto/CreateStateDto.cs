using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class CreateStateDto
    {
        public string? StateName { get; set; }

        public string? StateCode { get; set; }

        public int? CountryID { get; set; }
    }
}
