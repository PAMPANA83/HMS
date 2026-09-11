using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Billingtable
    {
        public int? Id { get; set; }
        public string?BillNumber { get; set; }
        public int PatientId { get; set; }
        public int? AppointmentId { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? PaidAmount { get; set; }
        public string? PaymentStatus { get; set; }
        public string PaymentMethod { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public Billingtable(int? id, string? billNumber, int patientId, int? appointmentId, decimal? totalAmount, decimal? paidAmount, string? paymentStatus, string paymentMethod, DateTimeOffset createdAt, int? createdBy)
        {
            Id = id;
            BillNumber = billNumber;
            PatientId = patientId;
            AppointmentId = appointmentId;
            TotalAmount = totalAmount;
            PaidAmount = paidAmount;
            PaymentStatus = paymentStatus;
            PaymentMethod = paymentMethod;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
        }
    }
}
