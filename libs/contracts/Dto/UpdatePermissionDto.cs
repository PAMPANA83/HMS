using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdatePermissionDto
    {
        [Required(ErrorMessage = "Module name is required.")]
        [MaxLength(50)]
        public string ModuleName { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}
