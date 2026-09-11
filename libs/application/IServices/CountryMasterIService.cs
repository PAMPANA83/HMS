using HSMS.contracts.Dto;
using HSMS.shared.Helpers;

namespace HSMS.Application.IServices
{
    public interface CountryMasterIService
    {
        Task<Result<string>> CreateCountryMasterAysnc(CountryMastersDto obj);
        Task<Result<List<CountryDto>>> GetAllCountryMastersAysnc();
        Task<Result<string>> DeleteCountryMasterAsync(int id);
    }
}
