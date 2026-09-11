using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class CreateCityDto
    {
        [Required(ErrorMessage = "City/District name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]       
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Postal code is required")]
        [StringLength(10, ErrorMessage = "Postal code cannot exceed 10 characters")]      
        public string PostalCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "State ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid State")]      
        public int StateID { get; set; }
    }
}
