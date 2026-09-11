using HSMS.Application.IRepositories;
using HSMS.Domain.Domains;
using HSMS.infrastructure.Entities;
using HSMS.infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.infrastructure.Repositories
{
    public class StateRepositories : IStateRepositories
    {
        private readonly ApplicationDbContext _context;

        public StateRepositories(ApplicationDbContext dbBase)
        {
            _context = dbBase;

        }

        public async Task<Statetable> CreateAsync(Statetable dto)
        {
            var res = new StateEntity
            {
                CountryId = (int)dto.CountryId,
                Name = dto.Name,
                StateCode = dto.StateCode,
                CreatedAt = (DateTimeOffset)dto.CreatedAt
            };
            await  _context.StateMasters.AddAsync(res);
            return dto;
        }

        public async Task<Statetable> DeleteAsync(Statetable dto)
        {
            StateEntity obj = new StateEntity
            {
                Id = (int)dto.Id,
                CountryId = (int)dto.CountryId,
                Name = dto.Name,
                StateCode = dto.StateCode,             
                CreatedAt = (DateTimeOffset)(dto.CreatedAt),
                UpdatedAt = (DateTimeOffset)(dto.UpdatedAt)
            };
            _context.StateMasters.Remove(obj);
            return dto;
        }

        public async Task<List<Statetable>> GetAllAsync()
        {
            var res = await _context.StateMasters.ToListAsync();
            var result = res.Select(s => new Statetable(
                        s.Id,
                        s.CountryId,
                        s.Name,
                        s.StateCode,
                        s.CreatedAt,
                        s.UpdatedAt
                    )).ToList();

            return result;

        }

        public async Task<Statetable?> GetByIdAsync(int id)
        {
            var res= await _context.StateMasters.FindAsync(id);
            var result = res != null ? new Statetable(
                        res.Id,
                        res.CountryId,
                        res.Name,
                        res.StateCode,
                        res.CreatedAt,
                        res.UpdatedAt
                    ) : null;

            return result;
        }

        public async Task<Statetable> UpdateAsync(Statetable dto)
        {
            var res = await _context.StateMasters.FindAsync(dto.Id);
            if (res != null)
            {
                res.CountryId=(int)dto.CountryId;
                res.Name = dto.Name;
                res.StateCode = dto.StateCode;               
                res.UpdatedAt = (DateTimeOffset)(dto.UpdatedAt);
                _context.StateMasters.Update(res);
            }
            return dto;
        }
    }
}
