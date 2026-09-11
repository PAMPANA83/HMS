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
    public class PermissionService: IPermissionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public PermissionService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<string>> CreatePermission(CreatePermissionDto dto)
        {
            try
            {
                var dtos = new Permissiontable(null, dto.PermissionCode, dto.ModuleName, dto.Description, DateTimeHelper.Now());

                var _res = await _unitOfWork.permission.createPermission(dtos);
                var res = await _unitOfWork.SaveChangesAsync();
                if (res <= 0)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to create city",
                    };
                }

                return new Result<string>
                {
                    Data= "Permission created successfully"
                };
            }
            catch (Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage = ex.Message
                };
            }

        }

        public async Task<Result<List<PermissionDto>>> GetAllPermissionAnysc()
        {
            try
            {
                var _res = await _unitOfWork.permission.GetAllPermissionAsyc();
                if(_res==null)
                {
                    return new Result<List<PermissionDto>>
                    {
                        ErrorMessage = "No permission Found"
                    };
                }

                var res = (from p in _res
                           select new PermissionDto
                           {
                               Id=(int)p.Id,
                               PermissionCode=p.PermissionCode,
                               ModuleName=p.ModuleName,
                               Description=p.Description,
                               CreatedAt= (DateTimeOffset)(p.CreatedAt??null),
                           }
                          ).ToList();


                return new Result<List<PermissionDto>>
                {
                    Data = res
                };
            }
            catch(Exception ex)
            {
                return new Result<List<PermissionDto>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
