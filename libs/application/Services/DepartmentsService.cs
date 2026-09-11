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
    public class DepartmentsService : IDepartmentsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public DepartmentsService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }
        public async Task<Result<string>> CreateDepartmentAsync(CreateDepartmentDto d)
        {
            try
            {
                var depat = new Departmenttable(null, d.BranchId, d.Name, d.Code,  DateTimeHelper.Now(),null);
                var dep = await _unitOfWork.Department.CreateDepartmentAsync(depat);
                var saveRes = await _unitOfWork.SaveChangesAsync();
                if (saveRes <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    _unitOfWork.Dispose();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to create Department"
                    };
                }
                else
                {
                    await _unitOfWork.CommitAsync();
                    _cache.Remove(CacheKeys.MainDepartList);
                    return new Result<string>
                    {
                        Data = "Create Department SuccessFully"
                    };
                }
            }
            catch(Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage=ex.Message
                };
            }

        }

        public async Task<Result<string>> DeleteDepartmentAsync(int id)
        {
            try
            {
                var getdepart= await _unitOfWork.Department.GetDepartmentAsync(id);
                if (getdepart == null)
                {
                    return new Result<string>
                    {
                        ErrorMessage="No Department found"
                    };
                }

                var dels = await _unitOfWork.Department.DeleteDepartmentAsync(getdepart);
                var saveRes = await _unitOfWork.SaveChangesAsync();
                if (saveRes <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    _unitOfWork.Dispose();
                    return new Result<string>
                    {
                        ErrorMessage = "Error while deleting Department"
                    };
                }
                else
                {
                    await _unitOfWork.CommitAsync();
                    _cache.Remove(CacheKeys.MainDepartList);
                    return new Result<string>
                    {
                        Data = "Department deleted successfully"
                    };
                }
               
               
            }
            catch (Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage =ex.Message
                };
            }
        }

        public async Task<Result<List<DepartmentDto>>> GetAllDepartmentAsync()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.MainDepartList, out List<DepartmentDto> cachedData))
                {
                    return new Result<List<DepartmentDto>>
                    {
                        Data = cachedData,
                    };
                }
                var res = await _unitOfWork.Department.GetAllDepartmentAsync();
                if(res.Count == 0)
                {
                    return new Result<List<DepartmentDto>>
                    {
                        ErrorMessage = "No Department found"
                    };
                }
                var branchs = await _unitOfWork.branch.GetAllAsync();
                if(branchs.Count==0)
                {
                    return new Result<List<DepartmentDto>>
                    {
                        ErrorMessage="No branch found"
                    };
                }
                var _result = (from d in res
                               join b in branchs on d.BranchId equals b.Id
                               select new DepartmentDto
                               {
                                   Id= (int)d.Id,
                                   BranchId=(int)d.BranchId,
                                   BranchName=b.BranchName,
                                   Name=d.Name,
                                   Code=d.Code,
                                   CreatedAt= (DateTimeOffset)(d.CreatedAt??null),
                                   UpdatedAt= (DateTimeOffset)(d.UpdatedAt??null)
                               }
                            ).ToList();
                return new Result<List<DepartmentDto>>
                {
                    Data = _result,
                };

            }
            catch (Exception ex)
            {
                return new Result<List<DepartmentDto>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<DepartmentDto>> GetDepartmentAsync(int id)
        {

            try
            {
                if (_cache.TryGetValue(CacheKeys.MainDepartList, out List<DepartmentDto> cachedData))
                {
                    var _res = cachedData.Where(x => x.Id == id).FirstOrDefault();
                    return new Result<DepartmentDto>
                    {
                        Data = _res,
                    };
                }
                var res = await _unitOfWork.Department.GetDepartmentAsync(id);
                if(res==null)
                {
                    return new Result<DepartmentDto>
                    {
                        ErrorMessage = "No Department found"
                    };
                }

                var barnchs = await _unitOfWork.branch.GetByIdAsync((int)res.BranchId);
                if(barnchs==null)
                {
                    return new Result<DepartmentDto>
                    {
                        ErrorMessage = "no branch found"
                    };
                }

                var _result = new DepartmentDto
                {
                    Id=(int)res.Id,
                    BranchId=(int)res.BranchId,
                    BranchName=barnchs.BranchName,
                    Name=res.Name,
                    Code=res.Code,
                    CreatedAt= (DateTimeOffset)(res.CreatedAt??null),
                    UpdatedAt= (DateTimeOffset)(res.UpdatedAt??null)
                };

                return new Result<DepartmentDto>
                {
                    Data = _result
                };
            }
            catch (Exception ex)
            {
                return new Result<DepartmentDto>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<string>> UpdateDepartmentAsync(UpdateDepartmentDto d)
        {
            try
            {
                var depat = new Departmenttable(d.Id, d.Branchid, d.Name, d.Code, null, DateTimeHelper.Now());
                var res = await _unitOfWork.Department.UpdateDepartmentAsync(depat);
                var saveRes = await _unitOfWork.SaveChangesAsync();
                if (saveRes <= 0)
                {
                    await _unitOfWork.RollbackAsync();                    
                    _unitOfWork.Dispose();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to update Department"
                    };
                }
                await _unitOfWork.CommitAsync();
                _cache.Remove(CacheKeys.MainDepartList);
                return new Result<string>
                {
                    Data = "Update Department SuccessFully"
                };
            }
            catch (Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage=ex.Message
                };
            }
        }
    }
}
