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
    public class PatientServices : IPatientServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public PatientServices(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<string>> CreatePatientAsync(CreatePatientDto dto)
        {
            try
            {
                var RecordNumber = await GenerateNewMrnAsync();
                var res = new Patienttable(null, RecordNumber, dto.FirstName, dto.LastName, dto.DateOfBirth,
                    dto.Gender, dto.PhoneNumber, dto.Email, true, DateTimeHelper.Now());
                var createpatient = await _unitOfWork.patients.CreatePatientAsync(res);
                var _res = await _unitOfWork.SaveChangesAsync();
                if (_res <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to create Patient",
                    };
                }
                _cache.Remove(CacheKeys.PatientList);
                await _unitOfWork.CommitAsync();
                var patients = await _unitOfWork.patients.GetPatientByName(dto.FirstName, dto.LastName);
                if(patients==null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "patient not found",
                    };
                }

                var appointment = new Appointmenttable(null, patients.PatientId, dto.DoctorId, dto.AppointmentDateTime, "Scheduled", dto.ReasonForVisit,
                    DateTimeHelper.Now());

                var Appoint = await _unitOfWork.appointment.CreateAppointmentAsync(appointment);
                var _resuit = await _unitOfWork.SaveChangesAsync();
                if (_resuit <= 0)
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
                    Data = "Patient created successfully",
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

        public async Task<Result<List<PatientDto>>> GetAllPatientAsync()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.PatientList, out List<PatientDto> cachedData))
                {
                    return new Result<List<PatientDto>>
                    {
                        Data = cachedData,
                    };
                }
                var res = await _unitOfWork.patients.GetAllPatientTablesAsync();
                if (res == null || res.Count == 0)
                {
                    return new Result<List<PatientDto>>
                    {
                        ErrorMessage = "No patient found"
                    };
                }

                var result = (from r in res

                              select new PatientDto
                              {
                                  PatientId = (int)r.PatientId,
                                  MedicalRecordNumber = r.MedicalRecordNumber,
                                  FirstName = r.FirstName,
                                  LastName = r.LastName,
                                  DateOfBirth = (DateTime)r.DateOfBirth,
                                  Gender = r.Gender,
                                  PhoneNumber=r.PhoneNumber,
                                  Email=r.Email,
                                  IsActive=r.IsActive,
                                  CreatedAt=r.CreatedAt

                              }
                       ).ToList();

                _cache.Set(CacheKeys.PatientList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });

                return new Result<List<PatientDto>>
                {
                    Data = result
                };


            }
            catch(Exception ex)
            {
                return new Result<List<PatientDto>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<string> GenerateNewMrnAsync()
        {
            string currentYear = DateTime.UtcNow.Year.ToString();
            int nextSequence = 1;
            var patients = await _unitOfWork.patients.GetAllPatientTablesAsync();

            if (patients != null)
            {
                // 2. Find the last patient added this year
                var lastPatient = patients
                    .Where(p => p.MedicalRecordNumber.StartsWith($"MRN-{currentYear}-"))
                    .OrderByDescending(p => p.PatientId)
                    .FirstOrDefault();


                // 3. Determine the next sequence number
                
                if (lastPatient != null)
                {
                    // Extract "000123" from "MRN-2026-000123"
                    string lastSequenceStr = lastPatient.MedicalRecordNumber.Split('-').Last();
                    if (int.TryParse(lastSequenceStr, out int lastNumber))
                    {
                        nextSequence = lastNumber + 1;
                    }
                }
            }
            // 4. Format: MRN-2026-000124 (Pads with leading zeros)
            return $"MRN-{currentYear}-{nextSequence:D6}";
        }

        public async Task<Result<PatientDto>> GetPatientById(int Id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.PatientList, out List<PatientDto> cachedData))
                {
                    var _res = cachedData?.FirstOrDefault(x => x.PatientId == Id);
                    if(_res==null)
                    {
                        return new Result<PatientDto>
                        {
                            ErrorMessage = "No Patient found"
                        };
                    }
                    return new Result<PatientDto>
                    {
                        Data = _res,
                    };
                }
                var res = await _unitOfWork.patients.GetPatientById(Id);
                if(res==null)
                {
                    return new Result<PatientDto>
                    {
                        ErrorMessage = "No Patient Found"
                    };
                }
                var result = new PatientDto
                {
                    PatientId=(int)res.PatientId,
                    MedicalRecordNumber=res.MedicalRecordNumber,
                    FirstName=res.FirstName,
                    LastName=res.LastName,
                    DateOfBirth= (DateTime)res.DateOfBirth,
                    Gender=res.Gender,
                    PhoneNumber=res.PhoneNumber,
                    Email=res.Email,
                    IsActive=res.IsActive,
                    CreatedAt=res.CreatedAt
                };

                return new Result<PatientDto>
                {
                    Data = result
                };
            }
            catch(Exception ex)
            {
                return new Result<PatientDto>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<string>> UpdatePatientAsync(UpdatePatientDto dto)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.PatientList, out List<Patienttable> cachedData))
                {
                    var _res = cachedData?.FirstOrDefault(x => x.PatientId == dto.PatientId);
                    if (_res != null)
                    {
                        var updatres = new Patienttable(_res.PatientId,_res.MedicalRecordNumber,dto.FirstName,
                            dto.LastName,dto.DateOfBirth,dto.Gender,_res.PhoneNumber,dto.Email,dto.IsActive, DateTimeHelper.Now());
                        var updoc = await _unitOfWork.patients.UpdatePatientAsync(updatres);
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
                            _cache.Remove(CacheKeys.PatientList);
                            return new Result<string>
                            {
                                Data = $"Successfully Update record {dto.PatientId}"
                            };
                        }
                    }
                }
                var res = await _unitOfWork.patients.GetPatientById(dto.PatientId);
                if (res == null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "no doctor found"
                    };
                }
                var updateres = new Patienttable(res.PatientId, res.MedicalRecordNumber, dto.FirstName,
                            dto.LastName, dto.DateOfBirth, dto.Gender, res.PhoneNumber, dto.Email, dto.IsActive, DateTimeHelper.Now());
                var updocs = await _unitOfWork.patients.UpdatePatientAsync(updateres);
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
                    _cache.Remove(CacheKeys.PatientList);
                    return new Result<string>
                    {
                        Data = $"Successfully Update record {dto.PatientId}"
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

        public async Task<Result<string>> DeletePatientAsync(int Id)
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.PatientList, out List<Patienttable> cachedData))
                {
                    var _res = cachedData?.Where(x => x.PatientId == Id).FirstOrDefault();
                    if (_res != null)
                    {
                        var del = new Patienttable(_res.PatientId, _res.MedicalRecordNumber, _res.FirstName,
                            _res.LastName, _res.DateOfBirth, _res.Gender, _res.PhoneNumber, _res.Email, _res.IsActive, _res.CreatedAt);

                        var deleteres = await _unitOfWork.patients.DeletePatientAsync(del);
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
                            _cache.Remove(CacheKeys.PatientList);
                            return new Result<string>
                            {
                                Data = "Successfully Delete record"
                            };
                        }
                    }

                }
                var res = await _unitOfWork.patients.GetPatientById(Id);
                if (res != null)
                {
                    var dels = new Patienttable(res.PatientId, res.MedicalRecordNumber, res.FirstName,
                            res.LastName, res.DateOfBirth, res.Gender, res.PhoneNumber, res.Email, res.IsActive, res.CreatedAt);
                    var deleteres = await _unitOfWork.patients.DeletePatientAsync(dels);
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
                        _cache.Remove(CacheKeys.PatientList);
                    }
                }

                return new Result<string>
                {
                    Data = "Successfully Delete record"
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

        public async Task<Result<List<PatientDropdown>>> GetAllPatientDropdown()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.PatientList, out List<PatientDto> cachedData))
                {

                    var _res = (from p in cachedData
                                select new PatientDropdown
                                  {
                                      Id = (int)p.PatientId,
                                      patientname = p.FirstName + " " + p.LastName
                                  }).ToList();
                    if (_res == null)
                    {
                        return new Result<List<PatientDropdown>>
                        {
                            ErrorMessage = "No Patient found"
                        };
                    }
                    return new Result<List<PatientDropdown>>
                    {
                        Data = _res,
                    };
                }
                var res = await _unitOfWork.patients.GetAllPatientTablesAsync();
                if (res == null || res.Count == 0)
                {
                    return new Result<List<PatientDropdown>>
                    {
                        ErrorMessage = "No patient found"
                    };
                }

                var result = (from p in res
                              select new PatientDropdown
                              {
                                  Id = (int)p.PatientId,
                                  patientname = p.FirstName + " " + p.LastName
                              }).ToList();

                return new Result<List<PatientDropdown>>
                {
                    Data = result
                };


            }
            catch(Exception ex)
            {
                return new Result<List<PatientDropdown>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
