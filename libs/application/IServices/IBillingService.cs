using HSMS.contracts.Dto;
using HSMS.shared.Helpers;

namespace HSMS.Application.IServices
{
    public interface IBillingService
    {
        Task<Result<string>> CreateAsync(CreateBillingDto dto);

        Task<Result<List<BillingDto>>> GetAllBillingAsync();

        Task<Result<string>> UpdateBillingAsync(UpdateBillingDto dto);

    }
    
}
