using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdateCountryDto
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "Country Name is required.")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "ISO Code is required.")]
        [StringLength(3, MinimumLength = 2)]
        public string IsoCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone Code is required.")]
        [MaxLength(10)]
        public string PhoneCode { get; set; } = string.Empty;
    }
}
