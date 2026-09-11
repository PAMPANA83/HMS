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
    public class RolePermissionService: IRolePermissionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public RolePermissionService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<List<RolePermissionDto>>> GetAllRollPermission()
        {
            try
            {
                var _res = await _unitOfWork.rolePermission.GetAllAsync();
                if(_res==null)
                {
                    return new Result<List<RolePermissionDto>>
                    {
                        ErrorMessage = "No Role permission found"
                    };
                }

                var roleID = _res.Select(x => x.roleID).ToList();
                var permissionID = _res.Select(x => x.PermissionId).ToList();

                var _role = await _unitOfWork.roleRepository.getALlRoleAsync();
                if (_role == null)
                {
                    return new Result<List<RolePermissionDto>>
                    {
                        ErrorMessage = "No Roles Found"
                    };
                }
                var _permission=await _unitOfWork.permission.GetAllPermissionAsyc();
                if(_permission==null)
                {
                    return new Result<List<RolePermissionDto>>
                    {
                        ErrorMessage = "No Permission Found"
                    };
                }
                var result = (from rp in _res
                              join ps in _permission on rp.PermissionId equals ps.Id
                              join r in _role on rp.roleID equals r.Id
                              select new RolePermissionDto
                              {
                                  RoleId=(int)rp.RoleId,
                                  RoleName=r.RoleName,
                                  RoleCode=r.RoleCode,
                                  PermissionId=(int)ps.Id,
                                  PermissionCode=ps.PermissionCode,
                                  ModuleName=ps.ModuleName,
                                  Description=ps.Description,
                                  GrantedAt= (DateTimeOffset)rp.GrantedAt,
                                  GrantedBy=rp.GrantedBy

                              }
                            ).ToList();

                return new Result<List<RolePermissionDto>>
                {
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new Result<List<RolePermissionDto>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
