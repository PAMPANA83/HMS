namespace HSMS.shared.Helpers
{
    public static class DateTimeHelper
    {
        public static DateTime Now() => DateTime.Now;         // Local time
        public static DateTime UtcNow() => DateTime.UtcNow;
    }
}
