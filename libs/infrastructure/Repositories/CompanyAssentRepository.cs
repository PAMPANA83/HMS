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
    public class CompanyAssentRepository : ICompanyAssentRepository
    {
        private readonly ApplicationDbContext _context;
        public CompanyAssentRepository(ApplicationDbContext dbBase)
        {
            _context = dbBase;
        }
        public async Task<List<CompanyAssettable>> GetCompanyAssettables(int Id)
        {
            var res = await _context.CompanyAssets.Where(x => x.CompanyId == Id).ToListAsync();
            if(res==null)
            {
                return null;
            }
            else
            {
                var result = res.Select(x => new CompanyAssettable(x.CompanyId, x.FilePath)).ToList();
                return result;
            }
        }
    }
}
