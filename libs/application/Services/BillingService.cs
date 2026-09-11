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

                var billing = new Billingtable(null, resbill,
                    dto.PatientId,
                    dto.AppointmentId,
                    dto.TotalAmount,
                    dto.PaidAmount,
                    "pending",
                    dto.PaymentMethod,
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
    }
}
