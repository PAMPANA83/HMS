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
    public class DoctorServices : IDoctorServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public DoctorServices(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<string>> CreateDocAsync(CreateDoctorDto dto)
        {
            try
            {
                var _res = new Doctorstable(null, dto.BranchId, dto.UserId, dto.DepartmentId,
                    dto.Specialization, dto.LicenseNumber, dto.ConsultationFee, dto.IsActive, 
                    DateTimeHelper.Now(),
                    dto.createBy, null, null);

                var res = await _unitOfWork.doctorRespositorys.AddAsync(_res);
                var results = await _unitOfWork.SaveChangesAsync();
                if (results <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "please try some time"
                    };
                }
                else
                {
                    _cache.Remove(CacheKeys.DoctorList);
                    await _unitOfWork.CommitAsync();
                }
                return new Result<string>
                {
                    Data = "Successfull created"
                };
            }
            catch(Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage = ex.Message
                };
            }
               
        }

        public async Task<Result<string>> DeleteDoctorbyId(int Id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.DoctorList, out List<DoctorDto> cachedData))
                {
                    var _res = cachedData?.Where(x => x.Id == Id).FirstOrDefault();
                    if (_res != null)
                    {
                       var del = new Doctorstable(_res.Id, _res.BranchId, _res.UserId, _res.DepartmentId,
                            _res.Specialization, _res.LicenseNumber, _res.ConsultationFee, _res.IsActive,
                            _res.CreatedAt, _res.CreatedBy, _res.UpdatedAt, _res.UpdatedBy);

                        var deleteres = await _unitOfWork.doctorRespositorys.DeleteAsync(del);
                        var delsave = await _unitOfWork.SaveChangesAsync();
                        if (delsave <= 0)
                        {
                            await _unitOfWork.RollbackAsync();
                            return new Result<string>
                            {
                                ErrorMessage = "please try some time"
                            };
                        }
                        else
                        {
                            await _unitOfWork.CommitAsync();
                            _cache.Remove(CacheKeys.DoctorList);
                            return new Result<string>
                            {
                                Data = "Successfully Delete record"
                            };
                        }
                    }
                   
                }
                var res = await _unitOfWork.doctorRespositorys.GetByIdAsync(Id);
                if (res != null)
                {
                    var dels = new Doctorstable(res.Id, res.BranchId, res.UserId, res.DepartmentId,
                         res.Specialization, res.LicenseNumber, res.ConsultationFee, res.IsActive,
                         res.CreatedAt, res.CreatedBy, res.UpdatedAt, res.UpdatedBy);
                    var deleteres = await _unitOfWork.doctorRespositorys.DeleteAsync(dels);
                    var delsave = await _unitOfWork.SaveChangesAsync();
                    if (delsave <= 0)
                    {
                        await _unitOfWork.RollbackAsync();
                        return new Result<string>
                        {
                            ErrorMessage = "please try some time"
                        };
                    }
                    else
                    {
                        await _unitOfWork.CommitAsync();
                        _cache.Remove(CacheKeys.DoctorList);
                    }
                }
                return new Result<string>
                {
                    Data = "Successfully Delete record"
                };
            }
            catch(Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage=ex.Message
                };
            }
        }

        public async Task<Result<List<DoctorDropdown>>> GetAllDoctorDetails()
        {
            try
            {
                var res = await _unitOfWork.User.GetAllUserAccount();
                if(res==null)
                {
                    return new Result<List<DoctorDropdown>>
                    {
                        ErrorMessage = "No user found"
                    };
                }


                var doctorRes = await _unitOfWork.doctorRespositorys.GetAllAsync();
                if (doctorRes == null || doctorRes.Count == 0)
                {
                    return new Result<List<DoctorDropdown>>
                    {
                        ErrorMessage = "No doctor records found"
                    };
                }

                var result = (from r in res                             
                              where r.EmployeeCode.StartsWith("D") 
                              && !doctorRes.Any(d => d.UserId == r.Id)
                              select new DoctorDropdown
                              {
                                  docId= (int)r.Id,
                                  docname=r.FirstName+" "+r.LastName
                              }
                              ).ToList();

                return new Result<List<DoctorDropdown>>
                {
                    Data = result
                };

            
            }
            catch(Exception ex)
            {
                return new Result<List<DoctorDropdown>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<List<DoctorDropdown>>> GetAllDoctorsDetails()
        {
            try
            {
                var res = await _unitOfWork.User.GetAllUserAccount();
                if (res == null)
                {
                    return new Result<List<DoctorDropdown>>
                    {
                        ErrorMessage = "No user found"
                    };
                }

                var doctorRes = await _unitOfWork.doctorRespositorys.GetAllAsync();
                if (doctorRes == null || doctorRes.Count == 0)
                {
                    return new Result<List<DoctorDropdown>>
                    {
                        ErrorMessage = "No doctor records found"
                    };
                }


                var result = (from r in res
                              join d in doctorRes on r.Id equals d.UserId
                              where r.EmployeeCode.StartsWith("D")
                              select new DoctorDropdown
                              {
                                  docId = (int)r.Id,
                                  docname = r.FirstName + " " + r.LastName
                              }
                              ).ToList();

                return new Result<List<DoctorDropdown>>
                {
                    Data = result
                };


            }
            catch (Exception ex)
            {
                return new Result<List<DoctorDropdown>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public  async Task<Result<List<DoctorDto>>> GetDoctorsAllAsync()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.DoctorList, out List<DoctorDto> cachedData))
                {
                    return new Result<List<DoctorDto>>
                    {
                        Data = cachedData,
                    };

                }
                var res = await _unitOfWork.doctorRespositorys.GetAllAsync();
                if(res.Count==0)
                {
                    return new Result<List<DoctorDto>>
                    {
                        ErrorMessage = "No companies found"
                    };
                }

                var _branch=await _unitOfWork.branch.GetAllAsync();
                if(_branch.Count==0)
                {
                    return new Result<List<DoctorDto>>
                    {
                        ErrorMessage = "No Branch found"
                    };
                }

                var _depart = await _unitOfWork.Department.GetAllDepartmentAsync();
                if(_depart.Count==0)
                {
                    return new Result<List<DoctorDto>>
                    {
                        ErrorMessage = "No Department found"
                    };
                }

                var users = await _unitOfWork.User.GetAllUserAccount();
                if(users.Count==0)
                {
                    return new Result<List<DoctorDto>>
                    {
                        ErrorMessage = "No Users found"
                    };
                }


                var result = (from r in res
                              join b in _branch on r.BranchId equals b.Id
                              join d in _depart on r.DepartmentId equals d.Id
                              join u in users on r.UserId equals u.Id
                              join rs in users on u.CreatedBy equals rs.Id into creatorGroup
                              from rs in creatorGroup.DefaultIfEmpty()
                              join rs1 in users on u.UpdatedBy equals rs1.Id into creatorGroups
                              from rs1 in creatorGroup.DefaultIfEmpty()
                              select new DoctorDto
                              {
                                  Id = (int)r.Id,
                                  BranchId = (int)r.BranchId,
                                  BranchName = b.BranchName,
                                  UserId=(int)r.UserId,
                                  DoctorName=u.FirstName+" "+u.LastName,
                                  DepartmentId=(int)r.DepartmentId,
                                  DepartmentName=d.Name,
                                  Specialization=r.Specialization,
                                  LicenseNumber=r.LicenseNumber,
                                  ConsultationFee=r.ConsultationFee,
                                  CreatedAt=r.CreatedAt,
                                  CreatedBy=r.CreatedBy,
                                  UpdatedAt=r.UpdatedAt,
                                  UpdatedBy=r.UpdatedBy,
                                  createdUser=rs.FirstName+" "+rs.LastName,
                                  updateUser=rs1.FirstName+" "+rs1.FirstName,
                                  IsActive=r.IsActive,
                              }
                            ).ToList();

                _cache.Set(CacheKeys.DoctorList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });

                return new Result<List<DoctorDto>>
                {
                    Data = result
                };

            }
            catch(Exception ex)
            {
                return new Result<List<DoctorDto>>
                {
                    ErrorMessage=ex.Message
                };
            }

        }

        public async Task<Result<DoctorDto>> GetDoctorsAsync(int Id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.DoctorList, out List<DoctorDto> cachedData))
                {

                    var resdata = cachedData?.Where(x => x.Id == Id).FirstOrDefault();
                    if(resdata==null)
                    {
                        return new Result<DoctorDto>
                        {
                            ErrorMessage = "No record found"
                        };
                    }

                    return new Result<DoctorDto>
                    {
                        Data = resdata,
                    };

                }
                var docres = await _unitOfWork.doctorRespositorys.GetByIdAsync(Id);
                if(docres==null)
                {
                    return new Result<DoctorDto>
                    {
                        ErrorMessage = "No Doctor Found"
                    };
                }

                var branchres = await _unitOfWork.branch.GetByIdAsync((int)docres.BranchId);
                if(branchres==null)
                {
                    return new Result<DoctorDto>
                    {
                        ErrorMessage = "No Branch Found"
                    };
                }

                var departres = await _unitOfWork.Department.GetDepartmentAsync((int)docres.DepartmentId);
                if(departres==null)
                {
                    return new Result<DoctorDto>
                    {
                        ErrorMessage = "No Department Found"
                    };
                }

                var users = await _unitOfWork.User.GetAllUserAccount();
                if (users.Count == 0)
                {
                    return new Result<DoctorDto>
                    {
                        ErrorMessage = "No Users found"
                    };
                }

                var username = users.Where(x => x.Id == docres.UserId).Select(x => x.FirstName + " " + x.LastName)
                              .FirstOrDefault();

                var createdUser = docres.CreatedBy.HasValue
                                ? users.FirstOrDefault(x => x.Id == docres.CreatedBy.Value)
                                : null;

                var updatedUser = docres.UpdatedBy.HasValue
                                ? users.FirstOrDefault(x => x.Id == docres.UpdatedBy.Value)
                                : null;

                var result = new DoctorDto
                {
                    Id = (int)docres.Id,
                    BranchId = (int)docres.BranchId,
                    BranchName = branchres.BranchName,
                    UserId = (int)docres.UserId,
                    DoctorName = username,
                    DepartmentId = docres.DepartmentId,
                    DepartmentName = departres.Name,
                    Specialization = docres.Specialization,
                    LicenseNumber = docres.LicenseNumber,
                    ConsultationFee = docres.ConsultationFee,
                    IsActive = docres.IsActive,
                    CreatedAt = docres.CreatedAt,
                    CreatedBy = docres.CreatedBy,
                    createdUser = createdUser?.FirstName+" "+createdUser?.LastName,
                    UpdatedAt = docres.UpdatedAt,
                    UpdatedBy = docres.UpdatedBy,
                    updateUser = updatedUser?.FirstName+" "+updatedUser?.LastName
                };

                return new Result<DoctorDto>
                {
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new Result<DoctorDto>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<string>> UpdateDocbyId(UpdateDoctorDto dto)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.DoctorList, out List<DoctorDto> cachedData))
                {
                  var _res =cachedData?.FirstOrDefault(x=>x.Id== dto.Id);
                    if (_res != null)
                    {
                        var updatres = new Doctorstable(_res.Id, dto.BranchId, _res.UserId, dto.DepartmentId,
                            dto.Specialization, dto.LicenseNumber, dto.ConsultationFee, dto.IsActive,
                            _res.CreatedAt, _res.CreatedBy, DateTimeHelper.Now(), dto.UpdateBy);
                        var updoc = await _unitOfWork.doctorRespositorys.UpdateAsync(updatres);
                        var upSave = await _unitOfWork.SaveChangesAsync();
                        if (upSave <= 0)
                        {
                            await _unitOfWork.RollbackAsync();
                            return new Result<string>
                            {
                                ErrorMessage = "please try some time"
                            };
                        }
                        else
                        {
                            await _unitOfWork.CommitAsync();
                            _cache.Remove(CacheKeys.DoctorList);
                            return new Result<string>
                            {
                                Data=$"Successfully Update record {dto.Id}"
                            };
                        }
                    }
                }
                var res = await _unitOfWork.doctorRespositorys.GetByIdAsync(dto.Id);
                if(res==null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "no doctor found"
                    };
                }
                var updateres = new Doctorstable(res.Id, dto.BranchId, res.UserId, dto.DepartmentId,
                         dto.Specialization, dto.LicenseNumber, dto.ConsultationFee, dto.IsActive,
                         res.CreatedAt, res.CreatedBy, DateTimeHelper.Now(), dto.UpdateBy);
                var updocs = await _unitOfWork.doctorRespositorys.UpdateAsync(updateres);
                var upSaves = await _unitOfWork.SaveChangesAsync();
                if (upSaves <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "please try some time"
                    };
                }
                else
                {
                    await _unitOfWork.CommitAsync();
                    _cache.Remove(CacheKeys.DoctorList);
                    return new Result<string>
                    {
                        Data = $"Successfully Update record {dto.Id}"
                    };
                }

            }
            catch(Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
