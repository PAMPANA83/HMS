using HSMS.Domain.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IRepositories
{
    public interface IDepartmentsRespository
    {
        Task<List<Departmenttable>> GetAllDepartmentAsync();
        Task<Departmenttable> CreateDepartmentAsync(Departmenttable dep);

        Task<Departmenttable> UpdateDepartmentAsync(Departmenttable dep);

        Task<Departmenttable>  DeleteDepartmentAsync(Departmenttable dep);

        Task<Departmenttable> GetDepartmentAsync(int id);


    }
}
