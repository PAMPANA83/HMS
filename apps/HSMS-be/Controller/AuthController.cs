using HSMS.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
  
    public class AuthController : ControllerBase
    {
        private readonly ITokenRevocationService  _tokenRevocationService;

        public AuthController(ITokenRevocationService tokenRevocationService)
        {
            _tokenRevocationService =tokenRevocationService;
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Get Authorization header

            var authorization =
                Request.Headers["Authorization"]
                    .ToString();

            if (string.IsNullOrWhiteSpace(authorization))
            {
                return Unauthorized(new
                {
                    success = false,
                    message =
                        "Authorization token is missing."
                });
            }

            // Check Bearer

            if (!authorization.StartsWith(
                    "Bearer ",
                    StringComparison.OrdinalIgnoreCase))
            {
                return Unauthorized(new
                {
                    success = false,
                    message =
                        "Invalid authorization header."
                });
            }

            // Extract JWT

            var token =
                authorization
                    .Substring("Bearer ".Length)
                    .Trim();

            if (string.IsNullOrWhiteSpace(token))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Token is empty."
                });
            }

            // Read JWT

            JwtSecurityToken jwtToken;

            try
            {
                var handler =
                    new JwtSecurityTokenHandler();

                jwtToken =
                    handler.ReadJwtToken(token);
            }
            catch
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid JWT token."
                });
            }

            // Get token expiry

            var expiry =
                jwtToken.ValidTo;

            // If already expired

            if (expiry <= DateTime.UtcNow)
            {
                return Ok(new
                {
                    success = true,
                    message =
                        "Token already expired."
                });
            }

            // Revoke token

            _tokenRevocationService.RevokeToken(
                token,
                expiry
            );

            return Ok(new
            {
                success = true,
                message =
                    "Logged out successfully."
            });
        }


    }
}
