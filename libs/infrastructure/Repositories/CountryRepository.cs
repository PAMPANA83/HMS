using HSMS.Application.IRepositories;
using HSMS.contracts.Dto;
using HSMS.infrastructure.Entities;
using HSMS.infrastructure.Persistence;
using HSMS.shared.Helpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Countrytable = HSMS.Domain.Domains.Countrytable;

namespace HSMS.infrastructure.Repositories
{
    public class CountryRepository : ICountryRepository
    {
        private readonly ApplicationDbContext _context;

        public CountryRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;

        }
        public async Task<Countrytable> CreateAsync(Countrytable dto)
        {
            CountryEntity obj=new CountryEntity
            {
                Name = dto.Name,
                IsoCode = dto.IsoCode,
                PhoneCode = dto.PhoneCode,
                CreatedAt = (DateTimeOffset)(dto.CreatedAt)
                
            };

            await _context.CountryMasters.AddAsync(obj);

            return dto;
        }
        public async Task<Countrytable> DeleteAsync(Countrytable dto)
        {

            CountryEntity obj = new CountryEntity
            {
                Id = (int)dto.Id,
                Name = dto.Name,
                IsoCode = dto.IsoCode,
                PhoneCode = dto.PhoneCode,
                CreatedAt = (DateTimeOffset)(dto.CreatedAt),
                UpdatedAt = (DateTimeOffset)(dto.UpdatedAt)
            };


            _context.CountryMasters.Remove(obj);
            return dto;
        }

        public async Task<List<Countrytable>> GetAllAsync()
        {
            var res = await _context.CountryMasters.ToListAsync();            
            var result= res.Select(x=> new Countrytable(x.Id, x.Name, x.IsoCode, x.PhoneCode, x.CreatedAt, x.UpdatedAt)).ToList();
            return result;
        }

        public async Task<Countrytable?> GetByIdAsync(int id)
        {
            var res = await _context.CountryMasters.Where(x=>x.Id==id).FirstOrDefaultAsync();
            var result = res == null ? null : new Countrytable(res.Id, res.Name, res.IsoCode, res.PhoneCode, res.CreatedAt, res.UpdatedAt);


            return result;
        }

        public async Task<Countrytable> UpdateAsync(Countrytable dto)
        {
           var res = await _context.CountryMasters.Where(x => x.Id == dto.Id).FirstOrDefaultAsync();
            if(res!=null)
            {
                res.Name = dto.Name;
                res.IsoCode = dto.IsoCode;
                res.PhoneCode = dto.PhoneCode;
                res.UpdatedAt = (DateTimeOffset)(dto.UpdatedAt);
                _context.CountryMasters.Update(res);            
            }
            return dto;
        }

        
    }
}
