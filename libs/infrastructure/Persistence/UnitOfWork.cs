using HSMS.Application.IRepositories;
using HSMS.Application.IServices;
using HSMS.Application.UoW;
using Microsoft.EntityFrameworkCore.Storage;

namespace HSMS.infrastructure.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;
        public ICountryRepository Countries { get; }
        public IStateRepositories Stateies { get; }
        public ICityRepository City { get; }
        public ICompanyRepository Company { get; }
        public IBranchRepository Branch { get; }
        public IAccountRepository accountRepository { get; }
        public IRoleRepository RoleRepository { get; }
        public IRolePermissionRepository rolePermissions { get; }
        public IPermissionRepository permissionRepository { get; }
        public IUserRepositories UserRepositories { get; }
        public IDepartmentsRespository departmentsRespository { get; }
        public ICompanyAssentRepository companyAssent { get; }
        public IDoctorRespository doctor { get; }
        public IPatientRepository _patient { get; }

        public IAppointmentRepository _appointment { get; }

        public IBillingRespository _billing { get; }

        public UnitOfWork(
            ApplicationDbContext context,
            ICountryRepository countryRepository,
            IStateRepositories stateies,
            ICityRepository city, ICompanyRepository company,
            IBranchRepository branch,IAccountRepository account, IRoleRepository role,
            IRolePermissionRepository rolePermissionRepository,IPermissionRepository permission,
            IUserRepositories repositories, IDepartmentsRespository departments,
            ICompanyAssentRepository companyAssentRepository, IDoctorRespository doctorRespository,
            IPatientRepository patientRepository,IAppointmentRepository appointmentRepository, IBillingRespository billingRespository)
        {
            _context = context;
            Countries = countryRepository;
            Stateies = stateies;
            City = city;
            Company = company;
            Branch = branch;
            accountRepository= account;
            RoleRepository = role;
            rolePermissions = rolePermissionRepository;
            permissionRepository = permission;
            UserRepositories = repositories;
            departmentsRespository=departments;
            companyAssent = companyAssentRepository;
            doctor = doctorRespository;
            _patient= patientRepository;
            _appointment = appointmentRepository;
            _billing = billingRespository;

        }

        public ICountryRepository Contries => Countries;
        public IStateRepositories State => Stateies;
        public ICityRepository CityMaster => City;
        public ICompanyRepository CompanyMaster => Company;
        public IBranchRepository branch => Branch;
        public IAccountRepository Accounts => accountRepository;
        public IRoleRepository roleRepository => RoleRepository;
        public IRolePermissionRepository rolePermission => rolePermissions;
        public IPermissionRepository permission => permissionRepository;
        public IUserRepositories User => UserRepositories;
        public IDepartmentsRespository Department => departmentsRespository;
        public ICompanyAssentRepository companyAssents => companyAssent;
        public IDoctorRespository doctorRespositorys => doctor;
        public IPatientRepository patients => _patient;
        public IAppointmentRepository appointment => _appointment;
        public IBillingRespository billingRespository => _billing;
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
        public async Task CommitAsync()
        {
            if (_transaction == null)
                return;
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public async Task RollbackAsync()
        {
            if (_transaction == null)
                return;
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
        
    }
}