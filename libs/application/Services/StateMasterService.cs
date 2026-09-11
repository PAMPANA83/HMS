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
    public class StateMasterService : IStateMasterService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public StateMasterService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<string>> CreateStateMasterAsync(CreateStateDto dto)
        {

            try
            {
                var res = new Statetable(null, dto.CountryID, dto.StateName, dto.StateCode,
                    DateTimeHelper.Now(), null);
                var _res = await _unitOfWork.Stateies.CreateAsync(res);
                var commitRes = await _unitOfWork.SaveChangesAsync();
                if(commitRes <= 0)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "Error while creating state"
                    };
                }
                else
                {
                    await _unitOfWork.CommitAsync();
                    _cache.Remove(CacheKeys.StateList);
                    return new Result<string>
                    {
                        Data = "State created successfully"
                    };
                }



            }
            catch(Exception ex)
            {
                _unitOfWork.Dispose();
                return new Result<string>
                {
                    ErrorMessage = ex.Message,
                };
            }

        }

        public async Task<Result<string>> DeleteStateMasterAsync(int id)
        {
            try
            {
                var res = await _unitOfWork.Stateies.GetByIdAsync(id);
                if(res==null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "No State Found"
                    };
                }

                var _res= await _unitOfWork.Stateies.DeleteAsync(res);
                var commitRes = await _unitOfWork.SaveChangesAsync();
                if(commitRes<=0)
                {
                  await  _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Error while deleting state"
                    };
                }
                else
                {
                   await _unitOfWork.CommitAsync();
                    _cache.Remove(CacheKeys.StateList);
                    return new Result<string>
                    {
                        Data = "State deleted successfully"
                    };
                }

            }
            catch(Exception ex)
            {
                _unitOfWork.Dispose();
               return new Result<string>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<Result<List<StateDto>>> GetAllStateMastersAysnc()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.StateList, out List<StateDto> cachedData))
                {
                    return new Result<List<StateDto>>
                    {
                        Data = cachedData,
                    };
                }
                var res = await _unitOfWork.Stateies.GetAllAsync();
                if (res==null)
                {
                    return new Result<List<StateDto>>
                    {
                        ErrorMessage = "No data found",
                    };
                }
                var states = res;
                var countryRes = await _unitOfWork.Contries.GetAllAsync();
                if (countryRes==null)
                {
                    return new Result<List<StateDto>>
                    {
                        ErrorMessage = "No data found",
                    };
                }
                var country = countryRes;

                List<StateDto> result = (from s in states
                                               join c in country
                                               on s.CountryId equals c.Id
                                               select new StateDto
                                               {
                                                 Id=(int) s.Id,
                                                 CountryId=(int)s.CountryId,
                                                 CountryName=c.Name??string.Empty,
                                                 Name=s.Name??string.Empty,
                                                 StateCode=s.StateCode,
                                                 CreatedAt= (DateTimeOffset)s.CreatedAt,
                                                 UpdatedAt=s.UpdatedAt,
                                               }).ToList();

                _cache.Set(CacheKeys.StateList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });

                return new Result<List<StateDto>>
                {
                    Data = result
                };
            }

            catch (Exception ex)
            {
                return new Result<List<StateDto>>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<Result<StateDto>> GetStateMasterByIdAsync(int id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.StateList, out List<StateDto> cachedData))
                {
                    var _res= cachedData.FirstOrDefault(x => x.Id == id);
                    return new Result<StateDto>
                    {
                        Data = _res,
                    };
                }
                var res = await _unitOfWork.Stateies.GetByIdAsync(id);
                if(res==null)
                {
                    return new Result<StateDto>
                    {
                        ErrorMessage = "No State found"
                    };
                }
                var country = await _unitOfWork.Contries.GetByIdAsync((int)res.CountryId);
                if(country==null)
                {
                    return new Result<StateDto>
                    {
                        ErrorMessage = "No Country Found"
                    };
                }
                var result = new StateDto
                {
                    Id =(int)res.Id,
                    CountryId =(int)res.CountryId,
                    CountryName= country.Name??string.Empty,
                    Name=res.Name??string.Empty,
                    StateCode=res.StateCode,
                    CreatedAt=(DateTimeOffset)res.CreatedAt,
                    UpdatedAt=res.UpdatedAt.HasValue? (DateTimeOffset?)res.UpdatedAt.Value : null
                };

                return new Result<StateDto>
                {
                    Data = result
                };


            }
            catch(Exception ex)
            {
                _unitOfWork.Dispose();
                return new Result<StateDto>
                {
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
