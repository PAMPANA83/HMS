using System.Net;
using System.Net.Sockets;

namespace HSMS.shared.Helpers
{
    public class GetIPAddress
    {
        public static string GetLocalIpAddress()
        {
            string localIP = "";
            var host = Dns.GetHostEntry(Dns.GetHostName());

            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    localIP = ip.ToString();
                    break;
                }
            }

            return localIP;
        }
    }
}
