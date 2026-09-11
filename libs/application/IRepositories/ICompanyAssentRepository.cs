using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface ICompanyAssentRepository
    {
        Task<List<CompanyAssettable>> GetCompanyAssettables(int Id);
    }
}
