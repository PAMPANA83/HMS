using HSMS.Application.IServices;
using HSMS.Application.UoW;
using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        public AccountService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<UserLoginDto>> GetUserbyEmail(string email, string password)
        {
            try
            {
                var _res = await _unitOfWork.Accounts.GetUserByEmailAsync(email);
                if(_res==null)
                {
                    return new Result<UserLoginDto>
                    {
                        ErrorMessage = "No User found"
                    };
                }
                var _country = await _unitOfWork.companyAssents.GetCompanyAssettables((int)_res.CompanyId);
                if (_country == null)
                {
                    return new Result<UserLoginDto>
                    {
                        ErrorMessage = "No country found"
                    };
                }
                var _role = await _unitOfWork.roleRepository.GetRoleById(_res.RoleId);
                if(_role==null)
                {
                    return new Result<UserLoginDto>
                    {
                        ErrorMessage = "No Role found"
                    };
                }
                var user = _res.FirstName + " " + _res.LastName;
                var role = _role.RoleName;

                if(password==_res.PasswordHash)
                {
                    return new Result<UserLoginDto>
                    {
                        ErrorMessage = "Invalid credentials or account inactive."
                    };
                }
               // bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, _res.PasswordHash);
                if (_res == null || !_res.IsActive )
                {
                    return new Result<UserLoginDto>
                    {
                        ErrorMessage= "Invalid credentials or account inactive."
                    };
                    
                }
                if (string.IsNullOrWhiteSpace(_res.PasswordHash) || _res.PasswordHash.Length < 60)
                {
                    return new Result<UserLoginDto>
                    {
                        ErrorMessage = "Invalid credentials or account inactive."
                    };
                    
                }
                var token = TokenService.GenerateJwtToken(user, role);
              
                    UserLoginDto obj = new UserLoginDto();
                obj.userId = _res.Id ?? 0;      
                obj.email = _res.Email;
                obj.name = user;
                obj.role = role;
                obj.Tokens = token;
                obj.logomin = _country[0].FilePath??null;
                obj.LogoMax = _country[1].FilePath??null;                
                return new Result<UserLoginDto>
                {
                    Data= obj
                };

            }
            catch (Exception ex)
            {
                return new Result<UserLoginDto>
                {
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
