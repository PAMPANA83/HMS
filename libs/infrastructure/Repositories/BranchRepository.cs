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
    public class BranchRepository : IBranchRepository
    {
        private readonly ApplicationDbContext _context;
        public BranchRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }
        public async Task<Branchtable> CreateAsync(Branchtable dto)
        {
            var res = new BranchEntity
            {
                CompanyId=(int)dto.CompanyId,
                BranchName=dto.BranchName,
                BranchCode=dto.BranchCode,
                Email=dto.Email,
                Phone=dto.Phone,
                AddressLine1=dto.AddressLine1,
                AddressLine2 =dto.AddressLine2,
                CityId=dto.CityId,
                StateId=dto.StateId,
                CountryId=dto.CountryId,
                PostalCode=dto.PostalCode,
                IsMainBranch= (bool)dto.IsMainBranch,
                IsActive=(bool)dto.IsActive,
                CreatedAt=dto.CreatedAt
            };
            await _context.BranchMaster.AddAsync(res);
            return dto;
        }

        public async Task<Branchtable> DeleteAsync(Branchtable dto)
        {
           var res= new BranchEntity
            {
                Id=(int)dto.Id,
                CompanyId = (int)dto.CompanyId,
                BranchName = dto.BranchName,
                BranchCode = dto.BranchCode,
                Email = dto.Email,
                Phone = dto.Phone,
                AddressLine1 = dto.AddressLine1,
                AddressLine2 = dto.AddressLine2,
                CityId = dto.CityId,
                StateId = dto.StateId,
                CountryId = dto.CountryId,
                PostalCode = dto.PostalCode,
                IsMainBranch = (bool)dto.IsMainBranch,
                IsActive = (bool)dto.IsActive,
                CreatedAt = (DateTimeOffset)dto.CreatedAt,
                UpdatedAt= dto.UpdatedAt.HasValue ? (DateTimeOffset)dto.UpdatedAt.Value : DateTimeOffset.MinValue
            };
            _context.BranchMaster.Remove(res);
            return dto;
        }

        public async Task<List<Branchtable>> GetAllAsync()
        {
            var res = await _context.BranchMaster.ToListAsync();
            var _res =res==null?null:  res.Select(x => new Branchtable(
                x.Id,x.CompanyId,x.BranchName,x.BranchCode,
                x.Email,x.Phone,x.AddressLine1,x.AddressLine2,
                x.CityId,x.StateId,x.CountryId,x.PostalCode,
                x.IsMainBranch,x.IsActive,x.CreatedAt,x.UpdatedAt)).ToList();
            return _res;
        }

        public async Task<Branchtable?> GetByIdAsync(int id)
        {
            var res = await _context.BranchMaster.FirstOrDefaultAsync(x => x.Id == id);
            var _res = res == null ? null : new Branchtable(
                res.Id, res.CompanyId, res.BranchName, res.BranchCode,
                res.Email, res.Phone, res.AddressLine1, res.AddressLine2,
                res.CityId, res.StateId, res.CountryId, res.PostalCode,
                res.IsMainBranch, res.IsActive, res.CreatedAt, res.UpdatedAt);
            return _res;
        }

        public async Task<Branchtable> UpdateAsync(Branchtable dto)
        {
            var res = await _context.BranchMaster.Where(x => x.Id == dto.Id).FirstOrDefaultAsync();
            if (res != null)
            {
                res.CompanyId = (int)dto.CompanyId;
                res.BranchName = dto.BranchName;
                res.BranchCode = dto.BranchCode;
                res.Email = dto.Email;
                res.Phone = dto.Phone;
                res.AddressLine1 = dto.AddressLine1;
                res.AddressLine2 = dto.AddressLine2;
                res.CityId = dto.CityId;
                res.StateId = dto.StateId;
                res.CountryId = dto.CountryId;
                res.PostalCode = dto.PostalCode;
                res.IsMainBranch = (bool)dto.IsMainBranch;
                res.IsActive = (bool)dto.IsActive;
                res.UpdatedAt =dto.UpdatedAt.HasValue ? (DateTimeOffset)dto.UpdatedAt.Value : DateTimeOffset.MinValue;
                _context.BranchMaster.Update(res);
            }
            return dto;
        }
    }
}
