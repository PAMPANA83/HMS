using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class EmailSettingDto
    {
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string SenderEmailfrom { get; set; }
        public string SenderPassword { get; set; }

        public string SenderToEmail { get; set; }
    }
}
