using System.Globalization;

namespace HSMS.shared.Helpers
{
    public class RegionCode
    {
        public static string RegionInfo(string regionName)
        {
            foreach (var culture in CultureInfo.GetCultures(CultureTypes.SpecificCultures))
            {
                var region = new RegionInfo(culture.Name);

                if (region.EnglishName.Equals(regionName, StringComparison.OrdinalIgnoreCase))
                {
                    return region.TwoLetterISORegionName;
                }
            }

            return string.Empty;
        }
    }
}
