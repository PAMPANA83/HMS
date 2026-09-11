using HSMS.Application.IServices;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.Services
{
    public class TokenRevocationService: ITokenRevocationService
    {
        private readonly IMemoryCache _cache;

        public TokenRevocationService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public bool IsTokenRevoked(string token)
        {
            return _cache.TryGetValue(
               $"revoked-token:{token}",
               out _
           );
        }

        public void RevokeToken(string token, DateTime expiry)
        {
            var remainingTime =
                 expiry - DateTime.UtcNow;

            if (remainingTime <= TimeSpan.Zero)
            {
                return;
            }

            _cache.Set(
                $"revoked-token:{token}",
                true,
                remainingTime
            );
        }
    }
}
