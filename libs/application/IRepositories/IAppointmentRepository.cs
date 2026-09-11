using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface IAppointmentRepository
    {

        Task<Appointmenttable> GetAppointByID(int Id);
        Task<List<Appointmenttable>> GetAllAppointments();
        Task<Appointmenttable> DeleteById(Appointmenttable dto);
        Task<Appointmenttable> CreateAppointmentAsync(Appointmenttable dto);
        Task<Appointmenttable> UpdateAppointmentAsync(Appointmenttable dto);
        Task<List<Appointmenttable>> GetAllAppointmentsbyPatientId(int Id);
    }
}
