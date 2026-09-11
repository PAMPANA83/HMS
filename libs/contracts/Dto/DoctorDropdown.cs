using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class DoctorDropdown
    {
        public int docId { get; set; }
        public string? docname { get; set; }
    }

    public class PatientDropdown
    {
        public int Id { get; set; }
        public string? patientname { get; set; }
    }
}
