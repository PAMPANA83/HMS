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
    public class PatientRepository : IPatientRepository
    {
        private readonly ApplicationDbContext _context;
        public PatientRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }
        public async Task<Patienttable> CreatePatientAsync(Patienttable dto)
        {
            PatientEntity obj = new PatientEntity();           
            obj.MedicalRecordNumber = dto.MedicalRecordNumber;
            obj.FirstName = dto.FirstName;
            obj.LastName = dto.LastName;
            obj.PhoneNumber = dto.PhoneNumber;
            obj.DateOfBirth = (DateTime)dto.DateOfBirth;
            obj.Email = dto.Email;
            obj.PhoneNumber = dto.PhoneNumber;
            obj.Gender = dto.Gender;
            obj.IsActive = dto.IsActive;
            obj.CreatedAt = dto.CreatedAt;
            await _context.Patients.AddAsync(obj);
            return dto;
        }

        public async Task<Patienttable> DeletePatientAsync(Patienttable dto)
        {
            PatientEntity obj = new PatientEntity();
            obj.PatientId =(int) dto.PatientId;
            obj.MedicalRecordNumber = dto.MedicalRecordNumber;
            obj.FirstName = dto.FirstName;
            obj.LastName = dto.LastName;
            obj.PhoneNumber = dto.PhoneNumber;
            obj.DateOfBirth = (DateTime)dto.DateOfBirth;
            obj.Email = dto.Email;
            obj.PhoneNumber = dto.PhoneNumber;
            obj.Gender = dto.Gender;
            obj.IsActive= dto.IsActive;
            obj.CreatedAt = dto.CreatedAt;
            _context.Patients.Remove(obj);
            return dto;
        }

        public async Task<List<Patienttable>> GetAllPatientTablesAsync()
        {
            var res = await _context.Patients.ToListAsync();
            if(res.Count == 0)
            {
                return null;
            }
            var _res = res.Select(x => new Patienttable(x.PatientId, x.MedicalRecordNumber, x.FirstName,
                x.LastName, x.DateOfBirth, x.Gender, x.PhoneNumber, x.Email, x.IsActive, x.CreatedAt)).ToList();
            return _res;
        }

        public async Task<Patienttable> GetPatientById(int Id)
        {
            var res=await _context.Patients.FirstOrDefaultAsync(x=>x.PatientId==Id);
            if(res==null)
            {
                return null;
            }
            var _res = new Patienttable(res.PatientId, res.MedicalRecordNumber, res.FirstName, res.LastName,
                res.DateOfBirth, res.Gender, res.PhoneNumber, res.Email, res.IsActive, res.CreatedAt);
            return _res;
        }

        public async Task<Patienttable> GetPatientByName(string fristname, string lastnam)
        {
           var res= await _context.Patients.FirstOrDefaultAsync(x=>x.FirstName==fristname && x.LastName==lastnam);
            if (res == null)
            {
                return null;
            }
            var _res = new Patienttable(res.PatientId, res.MedicalRecordNumber, res.FirstName, res.LastName,
                res.DateOfBirth, res.Gender, res.PhoneNumber, res.Email, res.IsActive, res.CreatedAt);
            return _res;
        }

        public async Task<Patienttable> UpdatePatientAsync(Patienttable dto)
        {

            PatientEntity obj = new PatientEntity();
            obj.PatientId = (int)dto.PatientId;
            obj.MedicalRecordNumber = dto.MedicalRecordNumber;
            obj.FirstName = dto.FirstName;
            obj.LastName = dto.LastName;
            obj.PhoneNumber = dto.PhoneNumber;
            obj.DateOfBirth = (DateTime)dto.DateOfBirth;
            obj.Email = dto.Email;
            obj.PhoneNumber = dto.PhoneNumber;
            obj.Gender = dto.Gender;
            obj.IsActive = dto.IsActive;
            obj.CreatedAt = dto.CreatedAt;

             _context.Patients.Update(obj);

            return dto;
        }
    }
}
