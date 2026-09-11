
using HSMS.Application.IServices;
using HSMS.Application.UoW;
using HSMS.contracts.Dto;
using HSMS.Domain.Domains;
using HSMS.shared.Helpers;
using Microsoft.Extensions.Caching.Memory;

namespace HSMS.Application.Services
{
    public class CountryMasterService: CountryMasterIService
    {
       
        private readonly IUnitOfWork _unitOfWork;
        
        private readonly IMemoryCache _cache;
        public CountryMasterService(IUnitOfWork unitOfWork,  IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            
            _cache = cache;
        }

        public async Task<Result<string>> CreateCountryMasterAysnc(CountryMastersDto obj)
        {
            try
            {               
                var _res = new Countrytable(null, obj.name,
                     obj.isoCode,
                     obj.phoneCode,
                      DateTimeHelper.Now(), null);                  

                var res =await _unitOfWork.Contries.CreateAsync(_res);           
                var saveRes = await _unitOfWork.SaveChangesAsync();
                if(saveRes <= 0)
                {
                   await _unitOfWork.RollbackAsync();
                    _unitOfWork.Dispose();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to create country"
                    };
                }


                _cache.Remove(CacheKeys.CountryList);
                return new Result<string>
                {
                    Data = "Country created successfully"
                };
            }
            catch (Exception ex)
            {
                 _unitOfWork.Dispose();
                return new Result<string>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<Result<string>> DeleteCountryMasterAsync(int id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.CountryList, out List<CountryDto> cachedData))
                {
                    var res1 = cachedData?.FirstOrDefault(c => c.Id == id);
                    var results = new Countrytable(res1.Id, res1.Name, res1.IsoCode, res1.PhoneCode, res1.CreatedAt, res1.UpdatedAt);
                    var _result = _unitOfWork.Contries.DeleteAsync(results);
                   var ss=  await _unitOfWork.SaveChangesAsync();
                    if(ss<=0)
                    {
                        await _unitOfWork.RollbackAsync();
                        _unitOfWork.Dispose();
                        return new Result<string>
                        {
                            ErrorMessage = "Failed to delete country"
                        };
                    }
                }
                else
                {
                    var res = await _unitOfWork.Contries.GetByIdAsync(id);
                    var result = new Countrytable(res.Id, res.Name, res.IsoCode, res.PhoneCode, res.CreatedAt, res.UpdatedAt);
                    var _res = _unitOfWork.Contries.DeleteAsync(result);
                    var saveRes = await _unitOfWork.SaveChangesAsync();
                    if(saveRes <= 0)
                    {
                        await _unitOfWork.RollbackAsync();
                        _unitOfWork.Dispose();
                        return new Result<string>
                        {
                            ErrorMessage = "Failed to delete country"
                        };
                    }
                }                 
                _cache.Remove(CacheKeys.CountryList);
                return new Result<string>
                {
                    Data = "Country deleted successfully"
                };

            }
            catch (Exception ex)
            {
                _unitOfWork.Dispose();
                return new Result<string>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<Result<List<CountryDto>>> GetAllCountryMastersAysnc()
        {

            if (_cache.TryGetValue(CacheKeys.CountryList, out List<CountryDto> cachedData))
            {
                return new Result<List<CountryDto>>
                {
                    Data = cachedData,
                };

            }
            var result = new List<CountryDto>();
            var res=await _unitOfWork.Contries.GetAllAsync();
            if(res!=null && res.Count()>0)
            {
                var countryDtos = res.Select(c => new CountryDto
                {
                    Id = (int)c.Id,
                    Name = c.Name,
                    IsoCode = c.IsoCode,
                    PhoneCode = c.PhoneCode,
                    CreatedAt = (DateTimeOffset)c.CreatedAt,
                    UpdatedAt = c.UpdatedAt.HasValue ? (DateTimeOffset)c.UpdatedAt.Value : DateTimeOffset.MinValue
                }).ToList();

                if (countryDtos != null)
                {
                    result = countryDtos;
                }
                _cache.Set(CacheKeys.CountryList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });

                return new Result<List<CountryDto>> { Data = result };
            }
            else
            {
                return new Result<List<CountryDto>> {  ErrorMessage = "No country masters found." };
            }
        }
    }
}
