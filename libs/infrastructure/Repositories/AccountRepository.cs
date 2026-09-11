using HSMS.Application.IRepositories;
using HSMS.Domain.Domains;
using HSMS.infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ApplicationDbContext _context;
        public AccountRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }
        public async Task<Usertable?> GetUserByEmailAsync(string email)
        {
            var res = await _context.UserMasters.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
            if (res == null)
            {
                return null;
            }
            else
            {
                var usertables = new Usertable(res.Id, res.CompanyId, res.BranchId, res.DepartmentId,
                    res.RoleId, res.EmployeeCode, res.FirstName, res.LastName, res.Gender, res.DateOfBirth,
                    res.Email, res.Phone, res.EmergencyContact, res.ProfileImageUrl, res.AddressLine1,
                    res.CityId, res.StateId, res.CountryId, res.PostalCode, res.IsActive, res.JoinedDate,
                    res.CreatedAt, res.CreatedBy, res.UpdatedAt, res.UpdatedBy,res.PasswordHash);
                return usertables;
            }
        }
    }
}
