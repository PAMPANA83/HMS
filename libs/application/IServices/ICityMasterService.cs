using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface ICityMasterService
    {
        Task<Result<List<CityDto>>> GetAllCityMastersAysnc();
        Task<Result<CityDto>> GetCityMasterByIdAsync(int id);
        Task<Result<string>> CreateCityMasterAsync(CreateCityDto dto);
        Task<Result<string>> UpdateCityMasterAsync(UpdateCityDto dto);
        Task<Result<string>> DeleteCityMasterAsync(int id);
    }
}
