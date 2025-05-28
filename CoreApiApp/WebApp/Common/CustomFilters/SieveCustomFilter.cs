using CoreApiApp.Data.Entities;
using Sieve.Services;

namespace CoreApiApp.Common.CustomFilters;

public class SieveCustomFilter: ISieveCustomFilterMethods
{
    public IQueryable<Staff> SearchFilter(IQueryable<Staff> source, string op, params string[] values)
    {
        if (values == null || values.Length == 0)
            return source;

        var searchTerm = string.Join(" ", values).ToLower();

        return source.Where(s =>
            (s.FirstName + " " + s.LastName).ToLower().Contains(searchTerm)
        );
    }

} 