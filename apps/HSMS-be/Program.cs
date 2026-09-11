using HSMS.Application.Abstractions;
using HSMS.Application.IRepositories;
using HSMS.Application.IServices;
using HSMS.Application.Services;
using HSMS.Application.UoW;
using HSMS.contracts.Dto;
using HSMS.infrastructure.Persistence;
using HSMS.infrastructure.Repositories;
using HSMS_be.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddMemoryCache();
// Add services to the container.
builder.Services.AddEndpointsApiExplorer(); // required for Swagger
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//builder.Services.Configure<SqlServerDto>(
//    builder.Configuration.GetSection("SqlServer"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));



#region File objects methods
builder.Services.AddSingleton<Confighelper>();
builder.Services.AddSingleton<SqlserverConnHelper>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
#endregion
#region Repositories
builder.Services.AddScoped<ICountryRepository, CountryRepository>();
builder.Services.AddScoped<IStateRepositories, StateRepositories>();
builder.Services.AddScoped<ICityRepository, CityRepository>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<IBranchRepository, BranchRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRolePermissionRepository, RolePermissionRepository>();
builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
builder.Services.AddScoped<IUserRepositories, UserRepositories>();
builder.Services.AddScoped<IDepartmentsRespository, DepartmentsRespository>();
builder.Services.AddScoped<ICompanyAssentRepository, CompanyAssentRepository>();
builder.Services.AddScoped<IDoctorRespository, DoctorRespository>();
builder.Services.AddScoped<IPatientRepository,PatientRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IBillingRespository, BillingRespository>();
#endregion

#region Register Services
builder.Services.AddScoped<CountryMasterIService, CountryMasterService>();
builder.Services.AddScoped<IStateMasterService, StateMasterService>();
builder.Services.AddScoped<ICityMasterService, CityMasterService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IBranchMasterService, BranchMasterService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IRoleMasterService, RoleMasterService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IUserMasterService, UserMasterService>();
builder.Services.AddScoped<IDepartmentsService, DepartmentsService>();
builder.Services.AddSingleton<ITokenRevocationService, TokenRevocationService>();
builder.Services.AddScoped<IDoctorServices, DoctorServices>();
builder.Services.AddScoped<IPatientServices, PatientServices>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IBillingService, BillingService>();

#endregion

//builder.Services.AddSwaggerGen(c =>
//{
//    c.SwaggerDoc("v1", new() { Title = "Hosptial API", Version = "v1" });
//});

#region JWT Bearer Token and Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = "HSMS",
            ValidAudience = "HSMSUsers",

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("MySuperSecretKey12345_123456789"                
                )
            )
        };
        options.Events =
            new JwtBearerEvents
            {
                OnTokenValidated = context =>
                {
                    var service =
                        context.HttpContext
                            .RequestServices
                            .GetRequiredService<
                                ITokenRevocationService>();

                    var authorization =
                        context.Request
                            .Headers["Authorization"]
                            .ToString();

                    var token =
                        authorization
                            .Replace(
                                "Bearer ",
                                "",
                                StringComparison
                                    .OrdinalIgnoreCase)
                            .Trim();

                    if (service.IsTokenRevoked(token))
                    {
                        context.Fail(
                            "Token has been revoked.");
                    }

                    return Task.CompletedTask;
                }
            };
    });
builder.Services.AddAuthorization();
#endregion

// Add services to the container.
builder.Services.AddEndpointsApiExplorer(); // required for Swagger

#region Register Swagger Generator


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hospital",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token."
    });

    c.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });
});
#endregion
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")  // Your React dev server
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // If using auth cookies/JWT
    });
});


var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowReactApp");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();     // serve generated Swagger as JSON
    app.UseSwaggerUI(options =>  // Serves Swagger UI at /swagger
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Hospital API v1");
        options.RoutePrefix = "swagger";  // Access at /swagger
    });   // serve Swagger UI
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

//app.MapGet("/swagger/index");

app.Run();

