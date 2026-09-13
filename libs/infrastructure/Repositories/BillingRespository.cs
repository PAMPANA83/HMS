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
            obj.CreatedAt=dto.CreatedAt;
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

            // Get the most recent billing entry (by Id). If none exists, start with 0001 for current year.
            var last = await _context.Billings.OrderByDescending(b => b.Id).FirstOrDefaultAsync();
            if (last == null || string.IsNullOrWhiteSpace(last.BillNumber))
            {
                return prefix + "0001";
            }

            var parts = last.BillNumber.Split('-');
            // Expected format: BILL-<year>-<sequence>
            if (parts.Length < 3)
            {
                return prefix + "0001";
            }

            // parts[1] should be year, parts[2] should be sequence number
            if (!int.TryParse(parts[1], out var lastYear) || lastYear != currentYear)
            {
                return prefix + "0001";
            }

            if (!int.TryParse(parts[2], out var lastSequence))
            {
                return prefix + "0001";
            }

            var newSequence = lastSequence + 1;
            return $"{prefix}{newSequence.ToString("D4")}";
        }

        public async Task<Billingtable?> GetByBillNumberAsync(string billNumber)
        {
            var res = await _context.Billings.FirstOrDefaultAsync(b => b.BillNumber == billNumber);
            if (res == null)
            {
                return null;
            }
            var _res = new Billingtable(res.Id, res.BillNumber, res.PatientId, res.AppointmentId,
                res.TotalAmount, res.PaidAmount, res.PaymentStatus, res.PaymentMethod,
                res.CreatedAt, res.CreatedBy);
            return _res;
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

        public async Task<Billingtable> UpdateBillingAsync(Billingtable dto)
        {
            BillingEntity obj = new BillingEntity();
            obj.Id = dto.Id ?? 0;
            obj.BillNumber = dto.BillNumber;
            obj.PatientId = dto.PatientId;
            obj.AppointmentId = dto.AppointmentId;
            obj.TotalAmount = dto.TotalAmount ?? 0;
            obj.PaidAmount = dto.PaidAmount ?? 0;
            obj.PaymentStatus = dto.PaymentStatus;
            obj.PaymentMethod = dto.PaymentMethod;
            obj.CreatedAt = dto.CreatedAt;
            obj.CreatedBy = dto.CreatedBy;
            _context.Billings.Update(obj);
            return dto;
        }
    }
}
