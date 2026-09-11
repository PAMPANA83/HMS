using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Entities
{
    [Table("Billings")]
    public class BillingEntity
    {
        [Key]      
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("bill_number")]
        public string BillNumber { get; set; }

        [Required]
        [Column("patient_id")]
        public int PatientId { get; set; }

        [Column("appointment_id")]
        public int? AppointmentId { get; set; }

        [Required]
        [Column("total_amount", TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Column("paid_amount", TypeName = "decimal(18,2)")]
        public decimal PaidAmount { get; set; } = 0.00m;

        [MaxLength(50)]
        [Column("payment_status")]
        public string PaymentStatus { get; set; } = "Pending";

        [MaxLength(50)]
        [Column("payment_method")]
        public string PaymentMethod { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

        [Column("created_by")]
        public int? CreatedBy { get; set; }
    }


}
