using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class CreateRoleDto
    {
        public int? CompanyId { get; set; }
        [Required(ErrorMessage = "Role code is required.")]
        [MaxLength(50)]
        public string RoleCode { get; set; } = string.Empty;
        [Required(ErrorMessage = "Role name is required.")]
        [MaxLength(100)]
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsSystemRole { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }
}
