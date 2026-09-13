using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class BillingDto
    {
        public int? Id { get; set; }
        public string? BillNumber { get; set; }
        public int PatientId { get; set; }
        public string? PatientName { get; set; }
        public int? AppointmentId { get; set; }
        public DateTimeOffset? AppointmentDate { get; set; }
        public string? doctorName { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? PaidAmount { get; set; }
        public string? PaymentStatus { get; set; }
        public string PaymentMethod { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
    }
}
