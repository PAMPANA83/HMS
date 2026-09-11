using System.Diagnostics;

namespace HSMS_be.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                var sw = Stopwatch.StartNew();
                _logger.LogInformation("Handling request: " + context.Request.Path);
                await _next(context); // Goes to Controller               
                _logger.LogInformation("Request path:"+context.Request.Path +" executed in {elapsed}:"+ sw.Elapsed.TotalSeconds+ " ms");
                _logger.LogInformation("Finished handling request: " + context.Request.Path + " with status code: " + context.Response.StatusCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled Exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }


        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var response = new
            {
                IsSuccess = false,
                Message = ex.Message,
                StackTrace = ex.StackTrace // remove in production
            };
          

            return context.Response.WriteAsJsonAsync(response);
        }
    }
}
