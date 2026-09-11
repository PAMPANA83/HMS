using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UpdateStatusAppointment
    {

        public int appointmentId { get; set; }

        public string status { get; set; }
    }
}
