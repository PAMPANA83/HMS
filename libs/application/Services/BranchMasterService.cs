using HSMS.Application.IServices;
using HSMS.Application.UoW;
using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.Services
{
    public class BranchMasterService : IBranchMasterService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public BranchMasterService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }
        public async Task<Result<string>> CreateBranchMasterAsync(CreateBranchDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<string>> DeleteBranchMasterAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<List<BranchDto>>> GetAllBranchMastersAysnc()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.BranchList, out List<BranchDto> cachedData))
                {
                    return new Result<List<BranchDto>>
                    {
                        Data = cachedData,
                    };
                }
                var res = await _unitOfWork.branch.GetAllAsync();
                if (res == null || res.Count == 0)
                {
                    return new Result<List<BranchDto>>
                    {
                        ErrorMessage = "No Branches Found",
                    };
                }
                var _state = await _unitOfWork.Stateies.GetAllAsync();
                if (_state == null || _state.Count == 0)
                {
                    return new Result<List<BranchDto>>
                    {
                        ErrorMessage = "No States Found",
                    };
                }
                var _country = await _unitOfWork.Contries.GetAllAsync();
                if (_country == null || _country.Count == 0)
                {
                    return new Result<List<BranchDto>>
                    {
                        ErrorMessage = "No Countries Found",
                    };
                }
                var _city = await _unitOfWork.City.GetAllAsync();
                if (_city == null || _city.Count == 0)
                {
                    return new Result<List<BranchDto>>
                    {
                        ErrorMessage = "No Cities Found",
                    };
                }
                var _company = await _unitOfWork.Company.GetAllAsync();
                if (_company == null || _company.Count == 0)
                {
                    return new Result<List<BranchDto>>
                    {
                        ErrorMessage = "No Companies Found",
                    };
                }

                var result = (from b in res
                              join c in _company on b.CompanyId equals c.Id
                              join s in _state on b.StateId equals s.Id into stateGroup
                              from sg in stateGroup.DefaultIfEmpty()
                              join co in _country on b.CountryId equals co.Id into countryGroup
                              from cg in countryGroup.DefaultIfEmpty()
                              join ci in _city on b.CityId equals ci.Id into cityGroup
                              from cig in cityGroup.DefaultIfEmpty()
                              select new BranchDto
                              {
                                  Id =(int) b.Id,
                                  CompanyId =(int)b.CompanyId,
                                  CompanyName= c.Name,
                                  BranchName = b.BranchName,
                                  BranchCode = b.BranchCode,
                                  Email= b.Email,
                                  Phone= b.Phone,
                                  AddressLine1= b.AddressLine1,
                                  AddressLine2= b.AddressLine2,
                                  CityId= b.CityId,
                                  CityName= cig != null ? cig.Name : string.Empty,
                                  StateId= b.StateId,
                                  StateName= sg != null ? sg.Name : string.Empty,
                                  CountryId= b.CountryId,
                                  CountryName= cg != null ? cg.Name : string.Empty,
                                  PostalCode= b.PostalCode,
                                  IsMainBranch=(bool)b.IsMainBranch,
                                  IsActive=(bool)b.IsActive,
                                  CreatedAt= (DateTimeOffset)b.CreatedAt,
                                  UpdatedAt= (DateTimeOffset)(b.UpdatedAt.HasValue?b.UpdatedAt:null)

                              }).ToList();

                _cache.Set(CacheKeys.BranchList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });
                return new Result<List<BranchDto>>
                {
                    Data = result,
                };
            }
            catch (Exception ex)
            {
                _unitOfWork.Dispose();
                return new Result<List<BranchDto>>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<Result<BranchDto>> GetBranchMasterByIdAsync(int id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.BranchList, out List<BranchDto> cachedData))
                {
                    var _res= cachedData?.FirstOrDefault(x => x.Id == id);
                    return new Result<BranchDto>
                    {
                        Data = _res,
                    };
                }
                var res = await _unitOfWork.branch.GetByIdAsync(id);
                if (res==null)
                {
                    return new Result<BranchDto>
                    {
                        ErrorMessage = "No Branch Found",
                    };

                }
                var _state = await _unitOfWork.Stateies.GetByIdAsync((int)res.StateId);
                if (_state == null )
                {
                    return new Result<BranchDto>
                    {
                        ErrorMessage = "No States Found",
                    };
                }
                var _country = await _unitOfWork.Contries.GetByIdAsync((int)res.CountryId);
                if (_country == null )
                {
                    return new Result<BranchDto>
                    {
                        ErrorMessage = "No Countries Found",
                    };
                }
                var _city = await _unitOfWork.City.GetByIdAsync((int)res.CityId);
                if (_city == null )
                {
                    return new Result<BranchDto>
                    {
                        ErrorMessage = "No Cities Found",
                    };
                }
                var _company = await _unitOfWork.Company.GetByIdAsync((int)res.CompanyId);
                if (_company == null)
                {
                    return new Result<BranchDto>
                    {
                        ErrorMessage = "No Companies Found",
                    };
                }

                var result = new BranchDto
                {
                    Id = (int)res.Id,
                    CompanyId = (int)res.CompanyId,
                    CompanyName = _company.Name,
                    BranchName = res.BranchName,
                    BranchCode = res.BranchCode,
                    Email = res.Email,
                    Phone = res.Phone,
                    AddressLine1 = res.AddressLine1,
                    AddressLine2 = res.AddressLine2,
                    CityId = res.CityId,
                    CityName = _city != null ? _city.Name : string.Empty,
                    StateId = res.StateId,
                    StateName = _state != null ? _state.Name : string.Empty,
                    CountryId = res.CountryId,
                    CountryName = _country != null ? _country.Name : string.Empty,
                    PostalCode = res.PostalCode,
                    IsMainBranch = (bool)res.IsMainBranch,
                    IsActive = (bool)res.IsActive,
                    CreatedAt = (DateTimeOffset)res.CreatedAt,
                    UpdatedAt = (DateTimeOffset)(res.UpdatedAt.HasValue ? res.UpdatedAt : null)
                };

                return new Result<BranchDto>
                {
                    Data = result,
                };


            }
            catch (Exception ex)
            {
                _unitOfWork.Dispose();
                return new Result<BranchDto>
                {
                    ErrorMessage = ex.Message,
                };
            }
        }

        public Task<Result<string>> UpdateBranchMasterAsync(UpdateBranchDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
