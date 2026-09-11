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
    public class UserRepositories : IUserRepositories
    {
        private readonly ApplicationDbContext _context;
        public UserRepositories(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }

        public async Task<Usertable> CreateUserAccount(Usertable dto)
        {
            var res = new UserEntity
            {
                CompanyId = dto.CompanyId,
                BranchId = dto.BranchId,
                DepartmentId = dto.DepartmentId,
                RoleId = dto.RoleId,
                EmployeeCode = dto.EmployeeCode,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                Email = dto.Email,
                Phone = dto.Phone,
                EmergencyContact = dto.EmergencyContact ?? null,
                ProfileImageUrl = dto.ProfileImageUrl ??null,
                AddressLine1=dto.AddressLine1,
                CityId=dto.CityId,
                StateId=dto.StateId,
                CountryId=dto.CountryId,
                PostalCode=dto.PostalCode,
                IsActive=dto.IsActive,
                JoinedDate=dto.JoinedDate,
                CreatedAt=dto.CreatedAt,
                CreatedBy=dto.CreatedBy,
                PasswordHash=dto.PasswordHash??null
            };

            await _context.UserMasters.AddAsync(res);
            return dto;
        }

        public async Task<List<Usertable>> GetAllUserAccount()
        {
            var res = await _context.UserMasters.ToListAsync();
            if (res.Count == 0)
            {
                return null;
            }
            var _res = res.Select(x => new Usertable(x.Id, x.CompanyId,x.BranchId,
                x.DepartmentId,x.RoleId,x.EmployeeCode,x.FirstName,x.LastName, x.Gender,
                x.DateOfBirth,x.Email,x.Phone,x.EmergencyContact,x.ProfileImageUrl,x.AddressLine1,
                x.CityId,x.StateId, x.CountryId,x.PostalCode,x.IsActive,x.JoinedDate,x.CreatedAt,
                x.CreatedBy,x.UpdatedAt,x.UpdatedBy,x.PasswordHash
                )).ToList();

            return _res;
        }

        public async Task<Usertable> GetUserByID(int id)
        {
            var res = await _context.UserMasters.Where(x => x.Id == id).FirstOrDefaultAsync();
            if(res==null)
            {
                return null;
            }
            var _res = new Usertable(res.Id, res.CompanyId, res.BranchId, res.DepartmentId, res.RoleId, res.EmployeeCode,
                res.FirstName, res.LastName, res.Gender, res.DateOfBirth, res.Email, res.Phone, res.EmergencyContact,
                res.ProfileImageUrl, res.AddressLine1, res.CityId, res.StateId, res.CountryId, res.PostalCode,
                res.IsActive,res.JoinedDate,res.CreatedAt,res.CreatedBy,res.UpdatedAt,res.UpdatedBy,res.PasswordHash);
            return _res;
        }
    }
}
