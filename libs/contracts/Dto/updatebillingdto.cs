using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdateBillingDto   
    {
        public string? BillNumber { get; set; }
        public decimal? PaidAmount { get; set; }
        public string? PaymentStatus { get; set; }
        public string PaymentMethod { get; set; }
    }
}
