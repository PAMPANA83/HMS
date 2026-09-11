using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class CreateRolePermissionDto
    {
        [Required(ErrorMessage = "Role is required.")]
        public int RoleId { get; set; }

        [Required(ErrorMessage = "Permission is required.")]
        public int PermissionId { get; set; }
    }
}
