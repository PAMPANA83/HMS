using HSMS.Application.IRepositories;
using HSMS.Domain.Domains;
using HSMS.infrastructure.Entities;
using HSMS.infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Repositories
{
    public class BillingRespository : IBillingRespository
    {

        private readonly ApplicationDbContext _context;
        public BillingRespository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }
        public async Task<Billingtable> CreateAsync(Billingtable dto)
        {
           BillingEntity obj=new BillingEntity();
            obj.BillNumber = dto.BillNumber;
            obj.PatientId = dto.PatientId;
            obj.AppointmentId = dto.AppointmentId;
            obj.TotalAmount = dto.TotalAmount ?? 0;
            obj.PaidAmount = dto.PaidAmount ?? 0;
            obj.PaymentStatus = dto.PaymentStatus;
            obj.PaymentMethod = dto.PaymentMethod;
            obj.CreatedAt = DateTimeOffset.Now;
            obj.CreatedBy = dto.CreatedBy;
            _context.Billings.Add(obj);  
            return dto;
        }

        public async Task<List<Billingtable>> GetBillingAsync()
        {
            var res = await _context.Billings.ToListAsync();        
                if(res == null || res.Count == 0)
                {
                return null;
                }

                var _res = res.Select(x => new Billingtable(x.Id, x.BillNumber, x.PatientId, x.AppointmentId,
                    x.TotalAmount, x.PaidAmount, x.PaymentStatus, x.PaymentMethod, x.CreatedAt, x.CreatedBy)).ToList();

            return _res;
        }

        public async Task<string> GetBillNumberAsync()
        {
            int currentYear = DateTime.UtcNow.Year;
            string prefix = $"BILL-{currentYear}-";
            var res = await _context.Billings.OrderByDescending(b => b.Id).FirstOrDefaultAsync();
            if (res == null)
            {
                return prefix+"0001";
            }
            else
            {
                var lastBillNumber = res.BillNumber;
                var lastBillNumberParts = lastBillNumber.Split('-');
                var lastBillNumberInt = int.Parse(lastBillNumberParts[1]);
                var newBillNumberInt = lastBillNumberInt + 1;
                var newBillNumber = $"{prefix}{newBillNumberInt.ToString("D5")}";
                return newBillNumber;
            }
        }

        public async Task<Billingtable?> GetByIdAsync(int id)
        {
           var res= await _context.Billings.FirstOrDefaultAsync(b => b.Id == id);
            if (res==null)
            {
                return null;
            }
            var _res = new Billingtable(res.Id, res.BillNumber, res.PatientId, res.AppointmentId, 
                res.TotalAmount, res.PaidAmount, res.PaymentStatus, res.PaymentMethod, 
                res.CreatedAt, res.CreatedBy);
            return _res;
        }
    }
}
