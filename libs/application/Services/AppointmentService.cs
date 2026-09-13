using HSMS.Application.IServices;
using HSMS.Application.UoW;
using HSMS.contracts.Dto;
using HSMS.Domain.Domains;
using HSMS.shared.Helpers;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public AppointmentService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }
        public async Task<Result<string>> createAppointmentAsync(CreateAppointmentDto dto)
        {
            try
            {
                
                var res = new Appointmenttable(null, dto.PatientId, dto.DoctorId, dto.AppointmentDateTime, "Scheduled",
                    dto.ReasonForVisit, DateTimeHelper.Now());
                var _res=await _unitOfWork.appointment.CreateAppointmentAsync(res);
                var resappoint = await _unitOfWork.SaveChangesAsync();
                if (resappoint <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to create Appointment",
                    };
                }
                await _unitOfWork.CommitAsync();
                _cache.Remove(CacheKeys.AppointmentList);
                return new Result<string>
                {
                    Data = "Appointment created successfully",
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

        public async Task<Result<string>> deleteAppointmentAsync(int Id)
        {
            try
            {
                var res = await _unitOfWork.appointment.GetAppointByID(Id);
                if(res==null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "No Record found"
                    };
                }
                var _res = await _unitOfWork.appointment.DeleteById(res);
                var _result=await _unitOfWork.SaveChangesAsync();
                if (_result <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to Delete Appointment",
                    };
                }
                await _unitOfWork.CommitAsync();
                _cache.Remove(CacheKeys.AppointmentList);
                return new Result<string>
                {
                    Data = $"Appointment delete successfully,{Id}",
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

        public async Task<Result<List<AppointmentDto>>> GetallAppointment()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.AppointmentList, out List<AppointmentDto> cachedData))
                {
                    return new Result<List<AppointmentDto>>
                    {
                        Data = cachedData,
                    };
                }

                var res = await _unitOfWork.appointment.GetAllAppointments();
                if (res == null || res.Count == 0)
                {
                    return new Result<List<AppointmentDto>>
                    {
                        ErrorMessage = "No record found"
                    };
                }

                var res_patient = await _unitOfWork.patients.GetAllPatientTablesAsync();
                if (res_patient == null|| res_patient.Count==0)
                {
                    return new Result<List<AppointmentDto>>
                    {
                        ErrorMessage = "No record found"
                    };
                }

                var res_doctor = await _unitOfWork.User.GetAllUserAccount();
                if(res_doctor==null || res_doctor.Count==0)
                {
                    return new Result<List<AppointmentDto>>
                    {
                        ErrorMessage = "No record found"
                    };
                }
                var excludedStatuses = new[] { "Completed", "Cancelled" };
                var result = (from r in res
                              join p in res_patient on r.PatientId equals p.PatientId
                              join d in res_doctor on r.DoctorId equals d.Id
                              where d.EmployeeCode.StartsWith('D')
                            //  && !excludedStatuses.Contains(r.Status)
                              select new AppointmentDto
                              {
                                  AppointmentId = (int)r.AppointmentId,
                                  PatientId = (int)r.PatientId,
                                  DoctorId = (int)r.DoctorId,
                                  AppointmentDateTime = (DateTimeOffset)r.AppointmentDateTime,
                                  Status = r.Status,
                                  ReasonForVisit = r.ReasonForVisit,
                                  CreatedAt = (DateTimeOffset)r.CreatedAt,
                                  MedicalRecordNumber=p.MedicalRecordNumber,
                                  FirstName=p.FirstName,
                                  LastName=p.LastName,
                                  DoctorName=d.FirstName+" "+d.LastName

                              }
                           ).ToList();
                _cache.Set(CacheKeys.AppointmentList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });

                return new Result<List<AppointmentDto>>
                {
                    Data = result
                };


            }
            catch(Exception ex)
            {
                return new Result<List<AppointmentDto>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<List<AppointmentDto>>> getAllAppointmentByPatientIdAsync(int Id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.AppointmentList, out List<AppointmentDto> cachedData))
                {


                    var _res = cachedData.Where(x => x.PatientId == Id).ToList();
                    return new Result<List<AppointmentDto>>
                    {
                        Data = _res,
                    };
                }

                var res = await _unitOfWork.appointment.GetAllAppointments();
                if (res == null || res.Count == 0)
                {
                    return new Result<List<AppointmentDto>>
                    {
                        ErrorMessage = "No record found"
                    };
                }

                var res_patient = await _unitOfWork.patients.GetAllPatientTablesAsync();
                if (res_patient == null || res_patient.Count == 0)
                {
                    return new Result<List<AppointmentDto>>
                    {
                        ErrorMessage = "No record found"
                    };
                }

                var res_doctor = await _unitOfWork.User.GetAllUserAccount();
                if (res_doctor == null || res_doctor.Count == 0)
                {
                    return new Result<List<AppointmentDto>>
                    {
                        ErrorMessage = "No record found"
                    };
                }
                var excludedStatuses = new[] { "Completed", "Cancelled" };
                var result = (from r in res

                              join p in res_patient on r.PatientId equals p.PatientId
                              join d in res_doctor on r.DoctorId equals d.Id
                              where d.EmployeeCode.StartsWith('D') && p.PatientId == Id
                             // && !excludedStatuses.Contains(r.Status)
                              select new AppointmentDto
                              {
                                  AppointmentId = (int)r.AppointmentId,
                                  PatientId = (int)r.PatientId,
                                  DoctorId = (int)r.DoctorId,
                                  AppointmentDateTime = (DateTimeOffset)r.AppointmentDateTime,
                                  Status = r.Status,
                                  ReasonForVisit = r.ReasonForVisit,
                                  CreatedAt = (DateTimeOffset)r.CreatedAt,
                                  MedicalRecordNumber = p.MedicalRecordNumber,
                                  FirstName = p.FirstName,
                                  LastName = p.LastName,
                                  DoctorName = d.FirstName + " " + d.LastName

                              }
                           ).OrderByDescending(x=>x.AppointmentDateTime).ToList();
              

                return new Result<List<AppointmentDto>>
                {
                    Data = result
                };

            }
            catch(Exception ex)
            {
                return new Result<List<AppointmentDto>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<AppointmentDto>> getAppointmentByIdAsync(int Id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.AppointmentList, out List<AppointmentDto> cachedData))
                {

                    var _res = cachedData?.FirstOrDefault(x => x.AppointmentId == Id);
                    if(_res==null)
                    {
                        return new Result<AppointmentDto>
                        {
                            ErrorMessage = "No record Found"
                        };
                    }
                    return new Result<AppointmentDto>
                    {
                        Data = _res,
                    };
                }
                var res = await _unitOfWork.appointment.GetAppointByID(Id);
                if(res==null)
                {
                    return new Result<AppointmentDto>
                    {
                        ErrorMessage = "No record found"
                    };
                }

                var res_patinet = await _unitOfWork.patients.GetPatientById((int)res.PatientId);
                if(res_patinet==null)
                {

                    return new Result<AppointmentDto>
                    {
                        ErrorMessage = "No record found"
                    };
                }

                var res_doutor = await _unitOfWork.User.GetUserByID((int)res.DoctorId);
                if(res_doutor==null)
                {
                    return new Result<AppointmentDto>
                    {
                        ErrorMessage = "No record found"
                    };
                }

                var result = new AppointmentDto
                {
                    AppointmentId=(int)res.AppointmentId,
                    PatientId=(int)res.PatientId,
                    DoctorId=(int)res.DoctorId,
                    AppointmentDateTime= (DateTimeOffset)res.AppointmentDateTime,
                    Status=res.Status,
                    ReasonForVisit=res.ReasonForVisit,
                    CreatedAt= (DateTimeOffset)res.CreatedAt,
                    MedicalRecordNumber = res_patinet.MedicalRecordNumber,
                    FirstName = res_patinet.FirstName,
                    LastName = res_patinet.LastName,
                    DoctorName = res_doutor.FirstName + " " + res_doutor.LastName
                };


                return new Result<AppointmentDto>
                {
                    Data = result
                };

            }
            catch(Exception ex)
            {
                return new Result<AppointmentDto>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<string>> updateAppointmentAsync(UpdateAppointmentDto dto)
        {
            try
            {
                var res = await _unitOfWork.appointment.GetAppointByID(dto.AppointmentId);
                if(res==null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "No record found"
                    };
                }
                var res_app = new Appointmenttable(res.AppointmentId, res.PatientId, dto.DoctorId, dto.AppointmentDateTime, "Scheduled",
                    dto.ReasonForVisit, res.CreatedAt);
                var updateAppoint=await _unitOfWork.appointment.UpdateAppointmentAsync(res_app);
                var updatsave = await _unitOfWork.SaveChangesAsync();
                if (updatsave <= 0)
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
                    _cache.Remove(CacheKeys.AppointmentList);
                    return new Result<string>
                    {
                        Data = $"Successfully Update record {dto.AppointmentId}"
                    };
                }

            }
            catch (Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<string>> updateStatusAppointmentAsync(UpdateStatusAppointment dto)
        {
            try
            {
                var res = await _unitOfWork.appointment.GetAppointByID(dto.appointmentId);
                if (res == null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "No record found"
                    };
                }
                
                var res_app = new Appointmenttable(res.AppointmentId, res.PatientId, res.DoctorId, res.AppointmentDateTime, dto.status,
                    res.ReasonForVisit, res.CreatedAt);
                var updateAppoint = await _unitOfWork.appointment.UpdateAppointmentAsync(res_app);
                var updatsave = await _unitOfWork.SaveChangesAsync();
                if (updatsave <= 0)
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
                    _cache.Remove(CacheKeys.AppointmentList);
                    return new Result<string>
                    {
                        Data = $"Successfully Update record {dto.appointmentId}"
                    };
                }

            }
            catch (Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
