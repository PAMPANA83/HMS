using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface IAppointmentService
    {
        Task<Result<string>> createAppointmentAsync(CreateAppointmentDto dto);
        Task<Result<string>> updateAppointmentAsync(UpdateAppointmentDto dto);
        Task<Result<string>> deleteAppointmentAsync(int Id);
        Task<Result<List<AppointmentDto>>> GetallAppointment();
        Task<Result<AppointmentDto>> getAppointmentByIdAsync(int Id);
        Task<Result<List<AppointmentDto>>> getAllAppointmentByPatientIdAsync(int Id);
        Task<Result<string>> updateStatusAppointmentAsync(UpdateStatusAppointment dto);

    }
}
