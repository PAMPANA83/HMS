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
    public class CompanyRepository : ICompanyRepository
    {
        private readonly ApplicationDbContext _context;
        public CompanyRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }
        public async Task<Companytable> CreateAsync(Companytable dto)
        {
            var res = new CompanyEntity
            {
               Name=dto.Name,
               RegistrationNumber=dto.RegistrationNumber,
               Gstin=dto.Gstin,
                PanNumber=dto.PanNumber,
                Email=dto.Email,
                Phone=dto.Phone,
                Website= dto.Website,
                AddressLine1=dto.AddressLine1,
                AddressLine2=dto.AddressLine2,
                CityId=dto.CityId,
                StateId=dto.StateId,
                CountryId=dto.CountryId,
                PostalCode=dto.PostalCode,
                IsActive= (bool)dto.IsActive,
                CreatedAt=dto.CreatedAt ?? DateTimeOffset.UtcNow,
            };
            await _context.CompaniesMasters.AddAsync(res);
            return dto;
        }

        public async Task<Companytable> DeleteAsync(Companytable dto)
        {
            var res = new CompanyEntity
            {
                Name = dto.Name,
                RegistrationNumber = dto.RegistrationNumber,
                Gstin = dto.Gstin,
                PanNumber = dto.PanNumber,
                Email = dto.Email,
                Phone = dto.Phone,
                Website = dto.Website,
                AddressLine1 = dto.AddressLine1,
                AddressLine2 = dto.AddressLine2,
                CityId = dto.CityId,
                StateId = dto.StateId,
                CountryId = dto.CountryId,
                PostalCode = dto.PostalCode,
                IsActive = (bool)dto.IsActive,
                CreatedAt = (DateTimeOffset)dto.CreatedAt,
                UpdatedAt= dto.UpdatedAt.HasValue ? (DateTimeOffset)dto.UpdatedAt.Value : DateTimeOffset.MinValue
            };
            _context.CompaniesMasters.Remove(res);
            return dto;
        }

        public async Task<List<Companytable>> GetAllAsync()
        {
            var res = await _context.CompaniesMasters.ToListAsync();
            var result = res==null?null: res.Select(x => new Companytable(x.Id, x.Name, x.RegistrationNumber,
                x.Gstin, x.PanNumber, x.Email, x.Phone, x.Website, x.AddressLine1, x.AddressLine2,
                x.CityId, x.StateId, x.CountryId, x.PostalCode, x.IsActive,
                x.CreatedAt, x.UpdatedAt)).ToList();
            return result;
        }

        public async Task<Companytable?> GetByIdAsync(int id)
        {
           var res = await _context.CompaniesMasters.FirstOrDefaultAsync(x => x.Id == id);
            if (res == null) return null;
            var result = new Companytable(res.Id, res.Name, res.RegistrationNumber,
                res.Gstin, res.PanNumber, res.Email, res.Phone, res.Website, res.AddressLine1, res.AddressLine2,
                res.CityId, res.StateId, res.CountryId, res.PostalCode, res.IsActive,
                res.CreatedAt, res.UpdatedAt);
            return result;
        }

        public async Task<Companytable> UpdateAsync(Companytable dto)
        {
           var res= await _context.CompaniesMasters.Where(x => x.Id == dto.Id).FirstOrDefaultAsync();
            if (res != null)
            {
                res.Name = dto.Name;
                res.RegistrationNumber = dto.RegistrationNumber;
                res.Gstin = dto.Gstin;
                res.PanNumber = dto.PanNumber;
                res.Email = dto.Email;
                res.Phone = dto.Phone;
                res.Website = dto.Website;
                res.AddressLine1 = dto.AddressLine1;
                res.AddressLine2 = dto.AddressLine2;
                res.CityId = dto.CityId;
                res.StateId = dto.StateId;
                res.CountryId = dto.CountryId;
                res.PostalCode = dto.PostalCode;
                res.IsActive = (bool)dto.IsActive;
                res.UpdatedAt = DateTimeOffset.UtcNow;
            }
            _context.CompaniesMasters.UpdateRange(res);
            return dto;
        }
    }
}
