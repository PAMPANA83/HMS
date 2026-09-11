using HSMS.Application.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace HSMS.infrastructure.Persistence
{
    public class SqlserverConnHelper
    {
        private readonly Confighelper _configs;

        public SqlserverConnHelper(Confighelper config)
        {
            _configs = config;
        }

        public ApplicationDbContext CreateDbContext()
        {
            var connsql = _configs.Config();
            string connString = $"Server=db45511.public.databaseasp.net; Database=db45511; User Id=db45511; Password=6b!AF+2h5r@J; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;";
            // Create DbContext options
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connString);

            // Create DbContext manually
            return new ApplicationDbContext(optionsBuilder.Options);
        }


    //public ApplicationDbContext CreateDbContext()
    //{
    //    var connsql = _configs.Config() ?? throw new InvalidOperationException("SQL configuration is missing.");

    //    var sb = new StringBuilder();

    //    sb.Append($"Server={connsql.server};");
    //    sb.Append($"Database={connsql.database};");

    //    if (!string.IsNullOrWhiteSpace(connsql.Trusted_Connection) &&
    //        connsql.Trusted_Connection.Equals("True", StringComparison.OrdinalIgnoreCase))
    //    {
    //        sb.Append("Trusted_Connection=True;");
    //    }
    //    else
    //    {
    //        sb.Append($"User Id={connsql.userID};Password={connsql.password};");
    //    }

    //    if (!string.IsNullOrWhiteSpace(connsql.MultipleActiveResultSets))
    //    {
    //        sb.Append($"MultipleActiveResultSets={connsql.MultipleActiveResultSets};");
    //    }
    //    else
    //    {
    //        sb.Append("MultipleActiveResultSets=True;");
    //    }

    //    if (!string.IsNullOrWhiteSpace(connsql.TrustServerCertificate))
    //    {
    //        sb.Append($"TrustServerCertificate={connsql.TrustServerCertificate};");
    //    }

    //    sb.Append("Encrypt=True;");
    //    sb.Append("Connect Timeout=30;");

    //    var connString = sb.ToString();

    //    var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
    //    // Enable transient retry policy (5 retries, 30s max delay)
    //    optionsBuilder.UseSqlServer(connString, sqlOptions =>
    //        sqlOptions.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(30), errorNumbersToAdd: null));

    //    return new ApplicationDbContext(optionsBuilder.Options);
    //}
    }
}
