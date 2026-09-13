using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface IBillingRespository
    {

        Task<Billingtable?> GetByIdAsync(int id);
        Task<Billingtable> CreateAsync(Billingtable dto);
        Task<List<Billingtable>> GetBillingAsync();
        Task<Billingtable> UpdateBillingAsync(Billingtable dto);
        Task<string> GetBillNumberAsync();

        Task<Billingtable?> GetByBillNumberAsync(string billNumber);
    }
}
