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
    public class RoleMasterService : IRoleMasterService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public RoleMasterService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }
        public async Task<Result<List<RoleDto>>> GetAllRoles()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.RolesList, out List<RoleDto> cachedData))
                {
                    return new Result<List<RoleDto>>
                    {
                        Data = cachedData,
                    };
                }
                var res = await _unitOfWork.roleRepository.getALlRoleAsync();
                if(res.Count==0)
                {
                    return new Result<List<RoleDto>>
                    {
                        ErrorMessage = "No Record Found"
                    };
                }

                var result = (from r in res
                              select new RoleDto
                              {
                                  Id = (int)r.Id,
                                  CompanyId=r.CompanyId,
                                  RoleCode=r.RoleCode,
                                  RoleName=r.RoleName,
                                  Description=r.Description,
                                  IsSystemRole=(bool)r.IsSystemRole,
                                  IsActive=(bool)r.IsActive,
                                  CreatedAt= (DateTimeOffset)r.CreatedAt,
                                  CreatedBy=r.CreatedBy,
                                  UpdatedAt= (DateTimeOffset)r.UpdatedAt,
                                  UpdatedBy=r.UpdatedBy
                              }).ToList();
                _cache.Set(CacheKeys.RolesList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });

                return new Result<List<RoleDto>>
                {
                    Data = result
                };

            }
            catch (Exception ex)
            {
                return new Result<List<RoleDto>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
