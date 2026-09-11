using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdateAppointmentDto
    {
        [Required]
        public int AppointmentId { get; set; }
        [Required]
        public int DoctorId { get; set; }

        [Required]
        public DateTimeOffset AppointmentDateTime { get; set; }

        //[Required]
        //[RegularExpression(
        //    "Scheduled|Checked-In|Completed|Cancelled|No-Show",
        //    ErrorMessage = "Invalid appointment status.")]
        //public string Status { get; set; } = "Scheduled";

        [MaxLength(255)]
        public string? ReasonForVisit { get; set; }
    }
}
