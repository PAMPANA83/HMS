using HSMS.Application.IRepositories;
using HSMS.contracts.Dto;
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
    public class DoctorRespository : IDoctorRespository
    {
        private readonly ApplicationDbContext _context;

        public DoctorRespository(ApplicationDbContext dbBase)
        {
            _context = dbBase;

        }

        public async Task<Doctorstable?> AddAsync(Doctorstable doc)
        {
            DoctorEntity dt = new DoctorEntity();
            dt.BranchId = (int)doc.BranchId;
            dt.UserId= (int)doc.UserId;
            dt.DepartmentId = doc.DepartmentId;
            dt.Specialization = doc.Specialization;
            dt.LicenseNumber = doc.LicenseNumber;
            dt.ConsultationFee = doc.ConsultationFee;
            dt.IsActive=doc.IsActive;
            dt.CreatedAt=doc.CreatedAt;
            dt.CreatedBy = doc.CreatedBy;

            await _context.Doctors.AddAsync(dt);
            return doc;
        }

        public async Task<Doctorstable> DeleteAsync(Doctorstable doctor)
        {
            var res = await _context.Doctors.FirstOrDefaultAsync(x => x.Id == doctor.Id);

            if (res != null)
            {
                _context.Doctors.Remove(res);
            }

            return doctor;
        }

        public Task DeleteAsync(DoctorDto? res)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Doctorstable>> GetAllAsync()
        {
            var res = await _context.Doctors.ToListAsync();
            var _res = res.Select(x => new Doctorstable(x.Id, x.BranchId, x.UserId, x.DepartmentId, x.Specialization,
                x.LicenseNumber, x.ConsultationFee, x.IsActive, x.CreatedAt, x.CreatedBy, x.UpdatedAt, x.UpdatedBy)).ToList();
            return _res;
        }

        public async Task<Doctorstable?> GetByIdAsync(int id)
        {
            var res=await _context.Doctors.FirstOrDefaultAsync(x => x.Id == id);
            if (res == null)
            {
                return null;
            }
            var _res=new Doctorstable(res.Id,res.BranchId,res.UserId,res.DepartmentId,res.Specialization,res.LicenseNumber,
                res.ConsultationFee,res.IsActive,res.CreatedAt,res.CreatedBy,res.UpdatedAt,res.UpdatedBy);
            return _res;
        }

        public async Task<Doctorstable> UpdateAsync(Doctorstable doc)
        {
            var res = await _context.Doctors.FirstOrDefaultAsync(x => x.Id == doc.Id);
            if (res != null)
            {
                res.LicenseNumber = doc.LicenseNumber;
                res.ConsultationFee = doc.ConsultationFee;
                res.UpdatedAt = doc.UpdatedAt;
                res.UpdatedBy = doc.UpdatedBy;

                _context.Doctors.Update(res);
            }         

            return doc;
        }
    }
}
