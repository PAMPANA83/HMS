using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Appointmenttable
    {
        public int? AppointmentId { get; set; }
        public int? PatientId { get; set; }
        public int? DoctorId { get; set; }
        public DateTimeOffset? AppointmentDateTime { get; set; }
        public string? Status { get; set; } = string.Empty;
        public string? ReasonForVisit { get; set; }
        public DateTimeOffset? CreatedAt { get; set; }

        public Appointmenttable(int? appoint, int? patientid,int? doctorid, DateTimeOffset? appointdate,string? status,string? visit, DateTimeOffset? createby)
        {
            AppointmentId = appoint;
            PatientId = patientid;
            DoctorId = doctorid;
            AppointmentDateTime = appointdate;
            Status = status;
            ReasonForVisit = visit;
            CreatedAt = createby;
        }
    } 
}
