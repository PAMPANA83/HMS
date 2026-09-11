using BCrypt.Net;
using HSMS.Application.IServices;
using HSMS.Application.UoW;
using HSMS.contracts.Dto;
using HSMS.Domain.Domains;
using HSMS.shared.Helpers;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.Services
{
    public class UserMasterService: IUserMasterService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public UserMasterService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<string>> createUserAccount(CreateUserDto dto)
        {
            
            try
            {
                DateTime dates = Convert.ToDateTime(dto.dateOfBirth);
                DateTime joindates = Convert.ToDateTime(dto.joinedDate);
                string newHash = BCrypt.Net.BCrypt.HashPassword(dto.password);
                var user = new Usertable(null, dto.companyId, dto.branchId, dto.departmentId,
                    dto.roleId, dto.employeeCode, dto.firstName, dto.lastName, dto.gender,
                    dates, dto.email, dto.phone, dto.emergencyContact, dto.profileImageUrl,
                    dto.addressLine1,dto.cityId,dto.stateId,dto.countryId,dto.postalCode,true,
                    joindates, DateTimeHelper.Now(),null,null,null,newHash);

                var creatusr=await _unitOfWork.User.CreateUserAccount(user);
                var saves = await _unitOfWork.SaveChangesAsync();
                if(saves<=0)
                {
                    await _unitOfWork.RollbackAsync();
                    _unitOfWork.Dispose();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to create user"
                    };
                }

                await _unitOfWork.CommitAsync();
                return new Result<string>
                {
                    Data = "User created successfully"
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

        public async Task<Result<List<UserDto>>> GetAllUsersAsync()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.UsersList, out List<UserDto> cachedData))
                {
                    return new Result<List<UserDto>>
                    {
                        Data = cachedData,
                    };
                }

                var res = await _unitOfWork.User.GetAllUserAccount();
                if(res.Count==0)
                {
                    return new Result<List<UserDto>>
                    { 
                      ErrorMessage="No User found"
                    };

                }

                var users = res;

                var comp = await _unitOfWork.Company.GetAllAsync();
                if (comp.Count == 0)
                {
                    return new Result<List<UserDto>>
                    {
                        ErrorMessage="No company found"
                    };
                }

                var branch = await _unitOfWork.branch.GetAllAsync();
                if(branch.Count==0)
                {
                    return new Result<List<UserDto>>
                    {
                        ErrorMessage = "No Branch found"
                    };
                }

                var citys=await _unitOfWork.City.GetAllAsync();
                if(citys.Count==0)
                {
                    return new Result<List<UserDto>>
                    {
                        ErrorMessage="No city found"
                    };
                }

                var states = await _unitOfWork.Stateies.GetAllAsync();
                if(states.Count==0)
                {
                    return new Result<List<UserDto>>
                    {
                        ErrorMessage="No State found"
                    };
                }

                var countrys = await _unitOfWork.Contries.GetAllAsync();
                if(countrys.Count==0)
                {
                    return new Result<List<UserDto>>
                    {
                        ErrorMessage="No Countries found"
                    };
                }

                var departs = await _unitOfWork.Department.GetAllDepartmentAsync();
                if(departs.Count==0)
                {
                    return new Result<List<UserDto>>
                    {
                        ErrorMessage="No Department found"
                    };
                }

                var roles = await _unitOfWork.roleRepository.getALlRoleAsync();
                if(roles.Count==0)
                {
                    return new Result<List<UserDto>>
                    {
                        ErrorMessage="No Role Found"
                    };
                }

                var results = (from u in res
                              join d in departs on u.DepartmentId equals d.Id
                              join cm in comp on u.CompanyId equals cm.Id
                              join r in roles on u.RoleId equals r.Id
                              join c in citys on u.CityId equals c.Id
                              join s in states on u.StateId equals s.Id
                              join ct in countrys on u.CountryId equals ct.Id
                               join rs in users on u.CreatedBy equals rs.Id into creatorGroup
                               from rs in creatorGroup.DefaultIfEmpty()
                               select new UserDto
                              {
                                  Id=(int)u.Id,
                                  CompanyId=u.CompanyId,
                                  CompanyName=cm.Name,
                                  DepartmentId=u.DepartmentId,
                                  DepartmentName=d.Name,
                                  RoleId=u.RoleId,
                                  RoleName=r.RoleName,
                                  RoleCode=r.RoleCode,
                                  EmployeeCode=u.EmployeeCode,
                                  FirstName=u.FirstName,
                                  LastName=u.LastName,
                                  Gender=u.Gender,
                                  DateOfBirth=u.DateOfBirth,
                                  Email=u.Email,
                                  Phone=u.Phone,
                                  EmergencyContact=u.EmergencyContact,
                                  AddressLine1=u.AddressLine1,
                                  CityId=u.CityId,
                                  CityName=c.Name,
                                  StateId=u.StateId,
                                  StateName=s.Name,
                                  CountryId=u.CountryId,
                                  CountryName=ct.Name,
                                  PostalCode=u.PostalCode,
                                  IsActive=u.IsActive,
                                  JoinedDate=u.JoinedDate,
                                  CreatedAt=u.CreatedAt,
                                  CreatedBy=u.CreatedBy,
                                  UpdatedAt= (DateTimeOffset)u.UpdatedAt,
                                  UpdatedBy=u.UpdatedBy,
                                  profileImageUrl=u.ProfileImageUrl,
                                  CreatedOn=rs.FirstName+" "+rs.LastName
                              }
                              ).ToList();

                _cache.Set(CacheKeys.UsersList, results, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });

                return new Result<List<UserDto>>
                {
                    Data= results
                };
            }
            catch (Exception ex)
            {
                return new Result<List<UserDto>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<UserDto>> GetUserByID(int id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.UsersList, out List<UserDto> cachedData))
                {
                    var _res= cachedData.FirstOrDefault(x => x.Id == id);
                    if(_res== null)
                    {
                        return new Result<UserDto>
                        {
                            ErrorMessage = "User not found"
                        };
                    }   

                    return new Result<UserDto>
                    {
                        Data = _res,
                    };
                }

                var res = await _unitOfWork.User.GetAllUserAccount();
                if (res.Count == 0)
                {
                    return new Result<UserDto>
                    {
                        ErrorMessage = "No User found"
                    };

                }

                var users = res;

                var comp = await _unitOfWork.Company.GetAllAsync();
                if (comp.Count == 0)
                {
                    return new Result<UserDto>
                    {
                        ErrorMessage = "No company found"
                    };
                }

                var branch = await _unitOfWork.branch.GetAllAsync();
                if (branch.Count == 0)
                {
                    return new Result<UserDto>
                    {
                        ErrorMessage = "No Branch found"
                    };
                }

                var citys = await _unitOfWork.City.GetAllAsync();
                if (citys.Count == 0)
                {
                    return new Result<UserDto>
                    {
                        ErrorMessage = "No city found"
                    };
                }

                var states = await _unitOfWork.Stateies.GetAllAsync();
                if (states.Count == 0)
                {
                    return new Result<UserDto>
                    {
                        ErrorMessage = "No State found"
                    };
                }

                var countrys = await _unitOfWork.Contries.GetAllAsync();
                if (countrys.Count == 0)
                {
                    return new Result<UserDto>
                    {
                        ErrorMessage = "No Countries found"
                    };
                }

                var departs = await _unitOfWork.Department.GetAllDepartmentAsync();
                if (departs.Count == 0)
                {
                    return new Result<UserDto>
                    {
                        ErrorMessage = "No Department found"
                    };
                }

                var roles = await _unitOfWork.roleRepository.getALlRoleAsync();
                if (roles.Count == 0)
                {
                    return new Result<UserDto>
                    {
                        ErrorMessage = "No Role Found"
                    };
                }

                var results = (from u in res
                               join d in departs on u.DepartmentId equals d.Id
                               join cm in comp on u.CompanyId equals cm.Id
                               join r in roles on u.RoleId equals r.Id
                               join c in citys on u.CityId equals c.Id
                               join s in states on u.StateId equals s.Id
                               join ct in countrys on u.CountryId equals ct.Id
                               join rs in users on u.CreatedBy equals rs.Id into creatorGroup
                               from rs in creatorGroup.DefaultIfEmpty()
                               where u.Id == id
                               select new UserDto
                               {
                                   Id = (int)u.Id,
                                   CompanyId = u.CompanyId,
                                   CompanyName = cm.Name,
                                   DepartmentId = u.DepartmentId,
                                   DepartmentName = d.Name,
                                   RoleId = u.RoleId,
                                   RoleName = r.RoleName,
                                   RoleCode = r.RoleCode,
                                   EmployeeCode = u.EmployeeCode,
                                   FirstName = u.FirstName,
                                   LastName = u.LastName,
                                   Gender = u.Gender,
                                   DateOfBirth = u.DateOfBirth,
                                   Email = u.Email,
                                   Phone = u.Phone,
                                   EmergencyContact = u.EmergencyContact,
                                   AddressLine1 = u.AddressLine1,
                                   CityId = u.CityId,
                                   CityName = c.Name,
                                   StateId = u.StateId,
                                   StateName = s.Name,
                                   CountryId = u.CountryId,
                                   CountryName = ct.Name,
                                   PostalCode = u.PostalCode,
                                   IsActive = u.IsActive,
                                   JoinedDate = u.JoinedDate,
                                   CreatedAt = u.CreatedAt,
                                   CreatedBy = u.CreatedBy,
                                   UpdatedAt = (DateTimeOffset)u.UpdatedAt,
                                   UpdatedBy = u.UpdatedBy,
                                   profileImageUrl = u.ProfileImageUrl,
                                   CreatedOn = rs.FirstName + " " + rs.LastName
                               }
                              ).FirstOrDefault();


                return new Result<UserDto>
                {
                    Data = results
                };



            }
            catch (Exception ex)
            {
                return new Result<UserDto>
                {
                    ErrorMessage = ex.Message
                };

            }
        }
    }
}
