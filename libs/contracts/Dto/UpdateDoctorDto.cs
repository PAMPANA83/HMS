using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdateDoctorDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int BranchId { get; set; }

        public int? DepartmentId { get; set; }

        [StringLength(100)]
        public string? Specialization { get; set; }

        [StringLength(50)]
        public string? LicenseNumber { get; set; }

        [Range(0, 9999999999999999.99)]
        public decimal? ConsultationFee { get; set; }

        public bool IsActive { get; set; }

        public int? UpdateBy { get; set; }
    }
}
