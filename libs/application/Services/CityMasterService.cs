using HSMS.Application.IServices;
using HSMS.Application.UoW;
using HSMS.contracts.Dto;
using HSMS.Domain.Domains;
using HSMS.shared.Helpers;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.Services
{
    public class CityMasterService : ICityMasterService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public CityMasterService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

       
        public async Task<Result<string>> CreateCityMasterAsync(CreateCityDto dto)
        {
           try
            {
                var city= new Citytable(null, dto.StateID, dto.Name, dto.PostalCode, DateTimeHelper.Now(), null);
                var res = await _unitOfWork.City.CreateAsync(city);
                var _res= await _unitOfWork.SaveChangesAsync();
                if(_res <= 0)
                {
                   await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to create city",
                    };
                }
                await _unitOfWork.CommitAsync();
                _cache.Remove(CacheKeys.CityList);
                return new Result<string>
                {
                    Data = "City created successfully",
                };
            }
            catch (Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<Result<string>> DeleteCityMasterAsync(int id)
        {
            try
            {
                var city = await _unitOfWork.City.GetByIdAsync(id);
                if (city == null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "City not found",
                    };
                }
                var delcity = await _unitOfWork.City.DeleteAsync(city);
                var _res = await _unitOfWork.SaveChangesAsync();

                if(_res <= 0)
                {
                   await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to delete city",
                    };
                }
                else
                {
                    await _unitOfWork.CommitAsync();
                }
                _cache.Remove(CacheKeys.CityList);
                return new Result<string>
                {
                    Data = "City deleted successfully",
                };
            }
            catch (Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<Result<List<CityDto>>> GetAllCityMastersAysnc()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.CityList, out List<CityDto> cachedData))
                {
                    return new Result<List<CityDto>>
                    {
                        Data = cachedData,
                    };
                }
                var res = await _unitOfWork.City.GetAllAsync();
                if (res == null)
                {
                    return new Result<List<CityDto>>
                    {
                        ErrorMessage = "No data found",
                    };
                }
                var cities = res;
                var countryRes = await _unitOfWork.Stateies.GetAllAsync();
                if (countryRes == null)
                {
                    return new Result<List<CityDto>>
                    {
                        ErrorMessage = "No data found",
                    };
                }
                var stateies = countryRes;
                List<CityDto> result = (from s in cities
                                         join c in stateies
                                         on s.StateId equals c.Id
                                         select new CityDto
                                         {
                                             Id =(int)s.Id,
                                             StateId = (int)s.StateId,
                                             StateName = c.Name ?? string.Empty,
                                             Name = s.Name ?? string.Empty,
                                             PostalCode = s.PostalCode,
                                             CreatedAt = (DateTimeOffset)s.CreatedAt,
                                             UpdatedAt = s.UpdatedAt.HasValue ? (DateTimeOffset)s.UpdatedAt.Value : DateTimeOffset.MinValue
                                         }).ToList();

                _cache.Set(CacheKeys.CityList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });
                return new Result<List<CityDto>>
                {
                    Data = result
                };

            }
            catch (Exception ex)
            {
                return new Result<List<CityDto>>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<Result<CityDto>> GetCityMasterByIdAsync(int id)
        {
            try
            {
                var res = await _unitOfWork.City.GetByIdAsync(id);
                if (res == null)
                {
                    return new Result<CityDto>
                    {
                        ErrorMessage = "City not found",
                    };
                }
                var stateRes = await _unitOfWork.Stateies.GetByIdAsync((int)res.StateId);
                if (stateRes == null)
                {
                    return new Result<CityDto>
                    {
                        ErrorMessage = "State not found",
                    };
                }
                var cityDto = new CityDto
                {
                    Id = (int)res.Id,
                    StateId = (int)res.StateId,
                    StateName = stateRes.Name ?? string.Empty,
                    Name = res.Name ?? string.Empty,
                    PostalCode = res.PostalCode,
                    CreatedAt = (DateTimeOffset)res.CreatedAt,
                    UpdatedAt = res.UpdatedAt.HasValue ? (DateTimeOffset)res.UpdatedAt.Value : DateTimeOffset.MinValue
                };
                return new Result<CityDto>
                {
                    Data = cityDto
                };

            }
            catch (Exception ex)
            {
                return new Result<CityDto>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<Result<string>> UpdateCityMasterAsync(UpdateCityDto dto)
        {
            try
            {
                var res=await _unitOfWork.City.GetByIdAsync(dto.Id);
                if (res == null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "City not found",
                    };
                }
                if(dto.StateId != res.StateId )
                {
                    res.StateId = (int)dto.StateId;
                }               
                res.PostalCode=dto.PostalCode;
                res.Name = dto.Name;
                res.UpdatedAt = DateTimeHelper.Now();
                var _res = await _unitOfWork.City.UpdateAsync(res);
                var saveRes = await _unitOfWork.SaveChangesAsync();
                if(saveRes <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to update city",
                    };
                }
                else
                {
                    await _unitOfWork.CommitAsync();
                }

                return new Result<string>
                {
                    Data = "Update City successfully"
                };
                
            }
            catch (Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }
    }
}
