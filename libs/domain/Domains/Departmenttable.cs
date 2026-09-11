using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Departmenttable
    {
        public int? Id { get; set; }
        public int? BranchId { get; set; }      
        public string? Name { get; set; } = string.Empty;
        public string? Code { get; set; } = string.Empty;
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }

        public Departmenttable(int?id, int? branchId, string? name, string? code, DateTimeOffset? createdAt, DateTimeOffset? updatedAt)
        {
            Id = id;
            BranchId = branchId;
            Name = name;
            Code = code;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
}
