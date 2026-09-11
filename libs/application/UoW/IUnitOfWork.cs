using HSMS.Application.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.UoW
{
    public interface IUnitOfWork : IDisposable
    {
        ICountryRepository Contries { get; }
        IStateRepositories Stateies { get; }
        ICityRepository City { get; }
        ICompanyRepository Company { get; }
        IBranchRepository branch { get; }
        IAccountRepository Accounts { get; }
        IRoleRepository roleRepository { get; }
        IRolePermissionRepository rolePermission { get; }
        IPermissionRepository permission { get; }
        IUserRepositories User { get; }
        IDepartmentsRespository Department { get; }
        ICompanyAssentRepository companyAssents { get; }
        IDoctorRespository doctorRespositorys { get; }        
        IPatientRepository patients { get; }
        IAppointmentRepository appointment { get; }
        Task<int> SaveChangesAsync();
        Task CommitAsync();
        Task RollbackAsync();
        IBillingRespository billingRespository { get; }

-    }
}
