using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Entities
{
    [Table("Appointments")]
    public class AppointmentEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AppointmentId { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        public int DoctorId { get; set; }

        [Required]
        public DateTimeOffset AppointmentDateTime { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Scheduled";

        [MaxLength(255)]
        public string? ReasonForVisit { get; set; }

        [Required]
        public DateTimeOffset CreatedAt { get; set; } 

        // Navigation Property
        [ForeignKey(nameof(PatientId))]
        public virtual PatientEntity? Patient { get; set; }

    }
}
