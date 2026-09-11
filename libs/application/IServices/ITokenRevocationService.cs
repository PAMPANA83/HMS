using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.IServices
{
    public interface ITokenRevocationService
    {
        void RevokeToken(string token, DateTime expiry);

        bool IsTokenRevoked(string token);
    }
}
