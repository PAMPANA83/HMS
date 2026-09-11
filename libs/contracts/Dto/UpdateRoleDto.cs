using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdateRoleDto
    {
        [Required(ErrorMessage = "Role name is required.")]
        [MaxLength(100)]
        public string RoleName { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsActive { get; set; }
    }
}
