using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class CreateBillingDto
    {
        public int PatientId { get; set; }
        public int? AppointmentId { get; set; }       
        public int? CreatedBy { get; set; }
    }
}
