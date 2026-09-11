using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface IBillingService
    {

        Task<Result<string>> CreateAsync(CreateBillingDto dto);
    }
    
}
