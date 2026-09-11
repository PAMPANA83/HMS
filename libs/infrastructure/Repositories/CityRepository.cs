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
    public class CityRepository : ICityRepository
    {
        private readonly ApplicationDbContext _context;
        public CityRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }
        public async Task<Citytable> CreateAsync(Citytable dto)
        {
            var entity = new CityEntity
            {
                StateId = (int)dto.StateId,
                Name = dto.Name,
                PostalCode = dto.PostalCode,
                CreatedAt = (DateTimeOffset)dto.CreatedAt,
               
            };
            _context.CityMasters.Add(entity); 
            return dto;
        }

        public async Task<Citytable> DeleteAsync(Citytable dto)
        {
           var res= new CityEntity
           {
               Id = (int)dto.Id,
               StateId = (int)dto.StateId,
               Name = dto.Name,
               PostalCode = dto.PostalCode,
                CreatedAt = (DateTimeOffset)dto.CreatedAt,
                UpdatedAt= dto.UpdatedAt.HasValue ? (DateTimeOffset)dto.UpdatedAt.Value : DateTimeOffset.MinValue,
           };
            _context.CityMasters.Remove(res);
            return dto;
        }

        public async Task<List<Citytable>> GetAllAsync()
        {
            var res = await _context.CityMasters.ToListAsync();
            var result = res.Select(x => new Citytable(x.Id,x.StateId,
                x.Name,x.PostalCode,
                x.CreatedAt,x.UpdatedAt)).ToList();
            return result;
        }

        public async Task<Citytable?> GetByIdAsync(int id)
        {
            var res=await _context.CityMasters.FirstOrDefaultAsync(x=>x.Id==id);
            var result = res == null ? null : new Citytable(res.Id, res.StateId,
                res.Name, res.PostalCode,
                res.CreatedAt, res.UpdatedAt);
            return result;
        }

        public async Task<Citytable> UpdateAsync(Citytable dto)
        {
            var res = await _context.CityMasters.Where(x => x.Id == dto.Id).FirstOrDefaultAsync();
            if (res != null)
            {
                res.Name = dto.Name;
                res.PostalCode = dto.PostalCode;                
                res.UpdatedAt = (DateTimeOffset)(dto.UpdatedAt);
                _context.CityMasters.Update(res);
            }
            return dto;
        }
    }
}
