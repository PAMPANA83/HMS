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
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;
   
        public AppointmentRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }
        public async Task<Appointmenttable> CreateAppointmentAsync(Appointmenttable dto)
        {
            AppointmentEntity obj = new AppointmentEntity();
            obj.PatientId = (int)dto.PatientId;
            obj.DoctorId = (int)dto.DoctorId;
            obj.AppointmentDateTime = (DateTimeOffset)dto.AppointmentDateTime;
            obj.Status = dto.Status;
            obj.ReasonForVisit= dto.ReasonForVisit;
            obj.CreatedAt = (DateTimeOffset)dto.CreatedAt;
            await _context.Appointments.AddRangeAsync(obj);
            return dto;

        }

        public async Task<Appointmenttable> DeleteById(Appointmenttable dto)
        {
            AppointmentEntity obj = new AppointmentEntity();
            obj.AppointmentId =(int)dto.AppointmentId;
            obj.PatientId = (int)dto.PatientId;
            obj.DoctorId = (int)dto.DoctorId;
            obj.AppointmentDateTime = (DateTimeOffset)dto.AppointmentDateTime;
            obj.Status = dto.Status;
            obj.ReasonForVisit = dto.ReasonForVisit;
            obj.CreatedAt = (DateTimeOffset)dto.CreatedAt;
            _context.Appointments.Remove(obj);
            return dto;
        }

        public async Task<List<Appointmenttable>> GetAllAppointments()
        {
            var res = await _context.Appointments.ToListAsync();
            if (res==null|| res.Count == 0)
            {
                return null;
            }
            var _res = res.Select(x => new Appointmenttable(x.AppointmentId, x.PatientId, x.DoctorId,
                x.AppointmentDateTime, x.Status, x.ReasonForVisit, x.CreatedAt)).ToList();
            return _res;
        }

        public async Task<List<Appointmenttable>> GetAllAppointmentsbyPatientId(int Id)
        {
            var res = await _context.Appointments.Where(x=>x.PatientId==Id).ToListAsync();
            if (res == null || res.Count == 0)
            {
                return null;
            }
            var _res = res.Select(x => new Appointmenttable(x.AppointmentId, x.PatientId, x.DoctorId,
                x.AppointmentDateTime, x.Status, x.ReasonForVisit, x.CreatedAt)).ToList();
            return _res;
        }

        public async Task<Appointmenttable> GetAppointByID(int Id)
        {
            var res=await _context.Appointments.AsNoTracking().FirstOrDefaultAsync(x=>x.AppointmentId == Id);
            if(res==null)
            {
                return null;
            }
            var _res = new Appointmenttable(res.AppointmentId, res.PatientId, res.DoctorId, res.AppointmentDateTime,
                res.Status, res.ReasonForVisit, res.CreatedAt);
            return _res;
        }

        public async Task<Appointmenttable> UpdateAppointmentAsync(Appointmenttable dto)
        {
            AppointmentEntity obj = new AppointmentEntity();
            obj.AppointmentId = (int)dto.AppointmentId;
            obj.PatientId = (int)dto.PatientId;
            obj.DoctorId = (int)dto.DoctorId;
            obj.AppointmentDateTime = (DateTimeOffset)dto.AppointmentDateTime;
            obj.Status = dto.Status;
            obj.ReasonForVisit = dto.ReasonForVisit;
            obj.CreatedAt = (DateTimeOffset)dto.CreatedAt;
            _context.Appointments.Update(obj);
            return dto;
        }
    }
}
