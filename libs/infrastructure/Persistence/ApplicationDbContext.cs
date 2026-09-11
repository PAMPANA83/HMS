using HSMS.infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace HSMS.infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        // DbSet represents a table in the database
        public DbSet<CountryEntity> CountryMasters { get; set; }
        public DbSet<StateEntity> StateMasters { get; set; }
        public DbSet<CityEntity> CityMasters { get; set; }
        public DbSet<CompanyEntity> CompaniesMasters { get; set; }
        public DbSet<BranchEntity> BranchMaster { get; set; }
        public DbSet<DepartmentEntity> DepartmentMaster { get; set; }
        public DbSet<RoleEntity> RoleMasters { get; set; }
        public DbSet<UserEntity> UserMasters { get; set; }
        public DbSet<PermissionEntity> PermissionMasters { get; set; }
        public DbSet<RolePermissionEntity> rolePermissions { get; set; }
        public DbSet<CompanyAssetEntity> CompanyAssets { get; set; }
        public DbSet<DoctorEntity> Doctors { get; set; }
        public DbSet<PatientEntity> Patients { get; set; }
        public DbSet<AppointmentEntity> appointment { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}
