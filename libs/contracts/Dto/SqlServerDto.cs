using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class SqlServerDto
    {
        public string server { get; set; }
        public string database { get; set; }
        public string userID { get; set; }
        public string password { get; set; }
        public string Trusted_Connection { get; set; }
        public string MultipleActiveResultSets { get; set; }
        public string TrustServerCertificate { get; set; }
        public string providerName { get; set; }
    }
}
