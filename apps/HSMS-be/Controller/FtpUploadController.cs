using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace HSMS_be.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class FtpUploadController : ControllerBase
    {
        private readonly string _ftpServer = "ftp://site61514.siteasp.net/wwwroot/img/";
        private readonly string _username = "site61514";
        private readonly string _password = "9Kq+#m8DL7@w";

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file provided." });
            }

            try
            {
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var ftpUrl = $"{_ftpServer}{fileName}";

                var request = (FtpWebRequest)WebRequest.Create(ftpUrl);
                request.Method = WebRequestMethods.Ftp.UploadFile;
                request.Credentials = new NetworkCredential(_username, _password);
                request.UseBinary = true;
                request.KeepAlive = false;
                request.UsePassive = true; // Essential for cloud hosting environments behind firewalls

                using (var ftpStream = await request.GetRequestStreamAsync())
                {
                    await file.CopyToAsync(ftpStream);
                }

                using var response = (FtpWebResponse)await request.GetResponseAsync();

                var publicUrl = $" https://pampana.runasp.net/img/{fileName}";

                return Ok(new { url = publicUrl, fileName = fileName, status = response.StatusDescription });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "FTP upload failed", error = ex.Message });
            }
        }
    }
}