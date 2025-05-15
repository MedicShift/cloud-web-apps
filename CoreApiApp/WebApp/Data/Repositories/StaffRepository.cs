using CoreApiApp.Common.Exceptions;
using CoreApiApp.Common.Mappings;
using CoreApiApp.Data.Entities;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace CoreApiApp.Data.Repositories;

public class StaffRepository : IStaffRepository
{
    
    private readonly ICoreDbContext _context;

    public StaffRepository(ICoreDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<StaffResponse>> GetAllHospitalStaffsAsync(Guid hospitaGuid)
    {
        var staffs = await _context.Staff
            .Include(s => s.Hospital)
            .Include(s => s.Department)
            .Where(s => s.Hospital.Guid == hospitaGuid)
            .ToListAsync();
        var response = StaffMapper.ToResponseList(staffs);
        if (staffs == null)
        {
            throw new NotFoundException("Staffs not found.");
        }
        return response;
    }

    public Task<bool> CreateHospitalStaffAsync(Staff staff)
    {
        throw new NotImplementedException();
    }
}