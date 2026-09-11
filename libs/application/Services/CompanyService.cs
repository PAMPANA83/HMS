using HSMS.Application.IServices;
using HSMS.Application.UoW;
using HSMS.contracts.Dto;
using HSMS.Domain.Domains;
using HSMS.shared.Helpers;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IUnitOfWork _unitOfWork;        
        private readonly IMemoryCache _cache;
        public CompanyService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<string>> CreateCompanyMasterAsync(CreateCompanyDto dto)
        {
            try
            {
                var comapny = new Companytable(null, dto.Name, dto.RegistrationNumber,
                              dto.Gstin, dto.PanNumber, dto.Email, dto.Phone, dto.Website,
                              dto.AddressLine1, dto.AddressLine2, dto.CityId, dto.StateId,
                              dto.CountryId, dto.PostalCode, dto.isActive, DateTimeHelper.Now(), null);
                var res = await _unitOfWork.Company.CreateAsync(comapny);
                var _res = await _unitOfWork.SaveChangesAsync();
                if(_res<=0)
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "please try some time"
                    };
                }
                else
                {
                    _cache.Remove(CacheKeys.CompanyList);
                    await _unitOfWork.CommitAsync();
                }

                return new Result<string>
                {
                    Data = "Company created successfully"
                };
                 
            }
            catch (Exception ex)
            {
                _unitOfWork.Dispose();
                return new Result<string>
                {
                    ErrorMessage = ex.Message
                };
            }


        }

        public async Task<Result<string>> DeleteCompanyMasterAsync(int id)
        {
            try
            {
                var res=await _unitOfWork.Company.GetByIdAsync(id);
                if (res == null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "Company not found"
                    };
                }
                var _res=await _unitOfWork.Company.DeleteAsync(res);
                var result=await _unitOfWork.SaveChangesAsync();
                if(result>0)
                {
                    await _unitOfWork.CommitAsync();
                    return new Result<string>
                    {
                        Data = "Company deleted successfully"
                    };
                }
                else
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Error deleting company"
                    };
                }

            }
            catch (Exception ex)
            {
                _unitOfWork.Dispose();
                return new Result<string>
                    {
                    ErrorMessage=ex.Message
                };
            }
        }

        public async Task<Result<List<CompanyDto>>> GetAllCompanyMastersAysnc()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.CompanyList, out List<CompanyDto> cachedData))
                {
                    return new Result<List<CompanyDto>>
                    {
                        Data = cachedData,
                    };

                }
                var res = await _unitOfWork.Company.GetAllAsync();
                if(res == null)
                {
                    return new Result<List<CompanyDto>>
                    {
                        ErrorMessage = "No companies found"
                    };
                }
                var cou = await _unitOfWork.Contries.GetAllAsync();
                if(cou==null)
                {
                    return new Result<List<CompanyDto>>
                    {
                        ErrorMessage = "No countries found"
                    };
                }
                var states = await _unitOfWork.Stateies.GetAllAsync();
                if(states==null)
                {
                    return new Result<List<CompanyDto>>
                    {
                        ErrorMessage = "No states found"
                    };
                }
                var cities = await _unitOfWork.City.GetAllAsync();
                if(cities==null)
                {
                    return new Result<List<CompanyDto>>
                    {
                        ErrorMessage = "No City found"
                    };

                }

                var result =(from c in res
                            join co in cou on c.CountryId equals co.Id into countryJoin
                            from country in countryJoin.DefaultIfEmpty()
                            join s in states on c.StateId equals s.Id into stateJoin
                            from state in stateJoin.DefaultIfEmpty()
                            join ci in cities on c.CityId equals ci.Id into cityJoin
                            from city in cityJoin.DefaultIfEmpty()
                            select new CompanyDto
                            {
                                Id = (int)c.Id,
                                Companyname = c.Name,
                                RegistrationNumber = c.RegistrationNumber,
                                Gstin = c.Gstin,
                                PanNumber = c.PanNumber,
                                Email = c.Email,
                                Phone = c.Phone,
                                Website = c.Website,
                                AddressLine1 = c.AddressLine1,
                                AddressLine2 = c.AddressLine2,
                                CityId = c.CityId,
                                CityName= city != null ? city.Name : null,
                                StateId = c.StateId,
                                StateName= state != null ? state.Name : null,
                                CountryId = c.CountryId,
                                CountryName=country != null ? country.Name : null,
                                CreatedAt= (DateTimeOffset)c.CreatedAt,
                                IsActive= (bool)c.IsActive,
                                UpdatedAt = c.UpdatedAt.HasValue ? (DateTimeOffset)c.UpdatedAt.Value : DateTimeOffset.MinValue
                            }).ToList();

                _cache.Set(CacheKeys.CompanyList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });

                return new Result<List<CompanyDto>>
                {
                    Data = result
                };
            }
            catch (Exception ex)
            {
                _unitOfWork.Dispose();
                return new Result<List<CompanyDto>>
                {
                    ErrorMessage = ex.Message
                };

            }
     
        }

        public async Task<Result<CompanyDto>> GetCompanyMasterByIdAsync(int id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.CompanyList, out List<CompanyDto> cachedData))
                {

                    var res1= cachedData.Where(x=>x.Id == id).FirstOrDefault();
                    return new Result<CompanyDto>
                    {
                        Data = res1,
                    };
                }
                var res = await _unitOfWork.Company.GetByIdAsync(id);
                if(res==null)
                {
                    return new Result<CompanyDto>
                    {
                        ErrorMessage = "No companies found"
                    };
                }

                var states = await _unitOfWork.Stateies.GetByIdAsync((int)res.StateId);
                if(states==null)
                {
                    return new Result<CompanyDto>
                    {
                        ErrorMessage = "No State found"
                    };
                }
                var _cite = await _unitOfWork.City.GetByIdAsync((int)res.CityId);
                if(_cite==null)
                {
                    return new Result<CompanyDto>
                    {
                        ErrorMessage = "No Company found"
                    };
                }
                var _country = await _unitOfWork.Contries.GetByIdAsync((int)res.CountryId);
                if(_country==null)
                {
                    return new Result<CompanyDto>
                    {
                        ErrorMessage="No Country found"
                    };
                }
                var result = new CompanyDto
                {
                    Id = (int)res.Id,
                    Companyname = res.Name,
                    RegistrationNumber = res.RegistrationNumber,
                    Gstin = res.Gstin,
                    PanNumber = res.PanNumber,
                    Email = res.Email,
                    Phone = res.Phone,
                    Website = res.Website,
                    AddressLine1 = res.AddressLine1,
                    AddressLine2 = res.AddressLine2,
                    CityId = res.CityId,
                    CityName = _cite?.Name,
                    StateId = res.StateId,
                    StateName = states?.Name,
                    CountryId = res.CountryId,
                    CountryName = _country?.Name,
                    PostalCode = res.PostalCode,
                    IsActive =(bool) res.IsActive,
                    CreatedAt = (DateTimeOffset)res.CreatedAt,
                    UpdatedAt = res.UpdatedAt.HasValue ? (DateTimeOffset)res.UpdatedAt.Value : DateTimeOffset.MinValue
                };

                return new Result<CompanyDto>
                {
                    Data = result
                };


            }
            catch(Exception ex)
            {
                return new Result<CompanyDto>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public Task<Result<CompanyDto>> UpdateCompanyMasterAsync(UpdateCompanyDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
