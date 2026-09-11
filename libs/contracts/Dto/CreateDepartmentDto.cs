using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class CreateDepartmentDto
    {      
        [Required(ErrorMessage = "Branch is required.")]
        public int BranchId { get; set; }

        [Required(ErrorMessage = "Department name is required.")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Department code is required.")]
        [MaxLength(10)]
        public string Code { get; set; } = string.Empty;
    }
}
