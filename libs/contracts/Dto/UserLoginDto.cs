using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.contracts.Dto
{
    public class UserLoginDto
    {
        public int userId { get; set; }
        public string email { get; set; }
        public string name { get; set; }
        public string role { get; set; }
        public string? Tokens { get; set; }
        public string? logomin { get; set; }
        public string? LogoMax { get; set; }

    }
}
