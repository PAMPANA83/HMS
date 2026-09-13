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
    public class BillingService: IBillingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public BillingService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }
        public async Task<Result<string>> CreateAsync(CreateBillingDto dto)
        {
            try
            {
                var resbill = await _unitOfWork.billingRespository.GetBillNumberAsync();
                if (resbill == null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to generate bill number"
                    };
                }



                var appointment = await _unitOfWork.appointment.GetAppointByID((int)dto.AppointmentId);
                if (appointment == null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "Appointment not found"
                    };
                }

                var doctor = await _unitOfWork.doctorRespositorys.GetByPatientIDAsync(appointment.DoctorId ?? 0);

                var billing = new Billingtable(null, resbill,
                    dto.PatientId,
                    dto.AppointmentId,
                    doctor?.ConsultationFee ?? 0,
                    null,
                    "Pending",
                    null,
                    DateTimeOffset.Now,
                    dto.CreatedBy);

                var result = await _unitOfWork.billingRespository.CreateAsync(billing);
                var saveResult = await _unitOfWork.SaveChangesAsync();
                if (saveResult <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to create Appointment",
                    };
                }

                await _unitOfWork.CommitAsync();
                _cache.Remove(CacheKeys.BillingList);
                return new Result<string>
                {
                    Data = "Billing created successfully"
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

        public async Task<Result<List<BillingDto>>> GetAllBillingAsync()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.BillingList, out List<BillingDto> cachedData))
                {
                    return new Result<List<BillingDto>>
                    {
                        Data = cachedData,
                    };
                }
                var billings = await _unitOfWork.billingRespository.GetBillingAsync();
                if (billings == null || !billings.Any())
                {
                    return new Result<List<BillingDto>>
                    {
                        ErrorMessage = "No billing records found"
                    };
                }

                var appoints= await _unitOfWork.appointment.GetAllAppointments();
                if (appoints == null || !appoints.Any())
                {
                    return new Result<List<BillingDto>>
                    {
                        ErrorMessage = "No appointment records found"
                    };
                }

                var patients= await _unitOfWork.patients.GetAllPatientTablesAsync();
                if (patients == null || !patients.Any())
                {
                    return new Result<List<BillingDto>>
                    {
                        ErrorMessage = "No patient records found"
                    };
                }

                var _resuser = await _unitOfWork.User.GetAllUserAccount();
                if (_resuser == null || !_resuser.Any())
                {
                    return new Result<List<BillingDto>>
                    {
                        ErrorMessage = "No user records found"
                    };
                }

                var users=_resuser.ToList();

                var result= (from billing in billings
                              join appoint in appoints on billing.AppointmentId equals appoint.AppointmentId
                             join patient in patients on billing.PatientId equals patient.PatientId
                              join user in _resuser on appoint.DoctorId equals user.Id
                             join rs in users on billing.CreatedBy equals rs.Id into creatorGroup
                             from rs in creatorGroup.DefaultIfEmpty()
                             select new BillingDto
                              {
                                  Id = billing.Id,
                                  BillNumber = billing.BillNumber,
                                  PatientId = billing.PatientId,
                                  PatientName = patient.FirstName + " " + patient.LastName,
                                  AppointmentId = billing.AppointmentId,
                                  AppointmentDate = appoint.AppointmentDateTime,
                                  doctorName = user.FirstName+" "+user.LastName,
                                  TotalAmount = billing.TotalAmount,
                                  PaidAmount = billing.PaidAmount,
                                  PaymentStatus = billing.PaymentStatus,
                                  PaymentMethod = billing.PaymentMethod,
                                  CreatedAt = billing.CreatedAt,
                                  CreatedBy = rs.FirstName+" "+rs.LastName
                             }).ToList();


                _cache.Set(CacheKeys.BillingList, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(3),
                    Priority = CacheItemPriority.High
                });


                return new Result<List<BillingDto>>
                {
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new Result<List<BillingDto>>
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Result<string>> UpdateBillingAsync(updatebillingdto dto)
        {
            try
            {
                var billing = await _unitOfWork.billingRespository.GetByBillNumberAsync(dto.BillNumber);
                if (billing == null)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "Billing record not found"
                    };
                }

                billing.PaidAmount = dto.PaidAmount ?? billing.PaidAmount;
                billing.PaymentStatus = dto.PaymentStatus ?? billing.PaymentStatus;
                billing.PaymentMethod = dto.PaymentMethod ?? billing.PaymentMethod;

                var result = await _unitOfWork.billingRespository.UpdateBillingAsync(billing);
                var saveResult = await _unitOfWork.SaveChangesAsync();
                if (saveResult <= 0)
                {
                    await _unitOfWork.RollbackAsync();
                    return new Result<string>
                    {
                        ErrorMessage = "Failed to update billing record",
                    };
                }
                await _unitOfWork.CommitAsync();
                _cache.Remove(CacheKeys.BillingList);

                return new Result<string>
                {
                    Data = "Billing record updated successfully"
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
    }
}
