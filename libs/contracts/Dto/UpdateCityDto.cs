using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdateCityDto
    {

        [Required]
        public int Id { get; set; }

        [Range(1, int.MaxValue)]
        public int StateId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        [RegularExpression(
            @"^[1-9][0-9]{5}$",
            ErrorMessage = "Postal code must be a valid 6-digit Indian PIN code.")]
        public string? PostalCode { get; set; }
    }
}
