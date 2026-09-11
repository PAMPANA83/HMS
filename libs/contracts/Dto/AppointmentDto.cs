using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }

        public int PatientId { get; set; }

        public string MedicalRecordNumber { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public int DoctorId { get; set; }

        public string DoctorName { get; set; }

        public DateTimeOffset AppointmentDateTime { get; set; }

        public string Status { get; set; } = string.Empty;

        public string? ReasonForVisit { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }
}
