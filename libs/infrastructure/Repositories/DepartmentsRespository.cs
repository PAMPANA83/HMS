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
    public class DepartmentsRespository: IDepartmentsRespository
    {
        private readonly ApplicationDbContext _context;
        public DepartmentsRespository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }

        public async Task<Departmenttable> CreateDepartmentAsync(Departmenttable dep)
        {
            var res = new DepartmentEntity
            {
               
                BranchId = (int)dep.BranchId,
                Name = dep.Name,
                Code = dep.Code,
                CreatedAt = (DateTimeOffset)(dep.CreatedAt ?? null),
              
            };
          await  _context.DepartmentMaster.AddAsync(res);
            return dep;
        }

        public async Task<Departmenttable> DeleteDepartmentAsync(Departmenttable dep)
        {
            var res = new DepartmentEntity
            {
                Id= (int)dep.Id,
                BranchId= (int)dep.BranchId,
                Name=dep.Name,
                Code=dep.Code,
                CreatedAt= (DateTimeOffset)(dep.CreatedAt??null),
                UpdatedAt= (DateTimeOffset)(dep.UpdatedAt??null)
            };

             _context.DepartmentMaster.Remove(res);
            return dep;
        }

        public async Task<List<Departmenttable>> GetAllDepartmentAsync()
        {
            var res = await _context.DepartmentMaster.ToListAsync();
            if(res.Count==null)
            {
                return null;
            }
            var _res = res.Select(x => new Departmenttable(x.Id,x.BranchId,x.Name,x.Code,
                x.CreatedAt,x.UpdatedAt)).ToList();
            return _res;
        }

        public async Task<Departmenttable> GetDepartmentAsync(int id)
        {
            var res = await _context.DepartmentMaster.Where(x => x.Id == id).FirstOrDefaultAsync();
            if(res==null)
            {
                return null;
            }
            var _res=new Departmenttable(res.Id,res.BranchId,res.Name,res.Code,res.CreatedAt,
                res.UpdatedAt);
            return _res;
        }

        public async Task<Departmenttable> UpdateDepartmentAsync(Departmenttable dep)
        {
            var res = new DepartmentEntity
            {
                Id = (int)dep.Id,
                BranchId = (int)dep.BranchId,
                Name = dep.Name,
                Code = dep.Code,               
                UpdatedAt = (DateTimeOffset)(dep.UpdatedAt ?? null)
            };
            _context.DepartmentMaster.Update(res);
            return dep;
        }
    }
}
