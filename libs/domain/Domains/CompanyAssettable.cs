using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class CompanyAssettable
    {
        public int? Id { get; set; }
        public string? FilePath { get; set; } = string.Empty;

        public CompanyAssettable(int? id, string? filePath)
        {
            Id = id;
            FilePath = filePath;
        }
    }
}
