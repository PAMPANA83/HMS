using HSMS.contracts.Dto;
using Microsoft.Extensions.Options;

namespace HSMS.Application.Abstractions
{
    public class Confighelper
    {
        private readonly SqlServerDto _sqlServer;
        private readonly EmailSettingDto _emailSetting;

        public Confighelper(IOptions<SqlServerDto> config, IOptions<EmailSettingDto> emailSetting)
        {
            _sqlServer = config.Value;
            _emailSetting = emailSetting.Value;
        }

        public SqlServerDto Config()
        {
            return _sqlServer;
        }

        public EmailSettingDto EmailConfig()
        {
            return _emailSetting;
        }
    }
}
