using CoreApiApp.Common.Enums;
using CoreApiApp.Common.Exceptions;
using CoreApiApp.Common.Mappings;
using CoreApiApp.Data.Entities;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Requests;
using CoreApiApp.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;

namespace CoreApiApp.Data.Repositories;

public class StaffRepository : IStaffRepository
{
    
    private readonly ICoreDbContext _context;
    private readonly SieveProcessor _sieveProcessor;

    public StaffRepository(ICoreDbContext context, SieveProcessor sieveProcessor)
    {
        _context = context;
        _sieveProcessor = sieveProcessor;
    }
    
    
    public async Task<StaffResponse> GetAllHospitalStaffsAsync(SieveModel sieveModel, Guid hospitaGuid)
    {
        var query =  _context.Staff
            .Include(s => s.Hospital)
            .Include(s => s.Department)
            .Where(s => s.Role != Role.Admin)
            .Where(s => s.Hospital.Guid == hospitaGuid).AsNoTracking();
        
        var filteredStaffs = _sieveProcessor.Apply(sieveModel, query, applyPagination: false);
        var count =  filteredStaffs.Count();
        
        var staffs = _sieveProcessor.Apply(sieveModel, filteredStaffs, applyPagination: true);
        
        var response = new StaffResponse()
        {
            Staffs = staffs.Select(s => StaffMapper.ToResponse(s)),
            TotalCount = count
        };
        if (staffs == null)
        {
            throw new NotFoundException("Staffs not found.");
        }
        return response;
    }

    public async Task<bool> CreateHospitalStaffAsync(CreateStaffRequest request)
    {
        if (await _context.Staff.AnyAsync(s => s.EmailId == request.EmailId))
        {
            return false;
        }
        
        var hospital = _context.Hospital.FirstOrDefault(h => h.Guid == request.HospitalId);
        var department = _context.Department.FirstOrDefault(d => d.Guid == request.DepartmentId);
        var password = "Medshift@123";
        
        var staff = new Staff();
        var hashedPassword = new PasswordHasher<Staff>()
            .HashPassword(staff, password);

        staff.EmailId = request.EmailId;
        staff.FirstName = request.FirstName;
        staff.LastName = request.LastName;
        staff.HospitalId = hospital.Id;
        staff.DepartmentId = department?.Id;
        staff.Role = request.Role;
        staff.PasswordHash = hashedPassword;
        
        await _context.Staff.AddAsync(staff);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> UpdateHospitalStaffAsync(UpdateStaffRequest request)
    {
        var staff = _context.Staff.FirstOrDefault(s => s.Guid == request.StaffGuid);
        
        if (staff == null)
        {
            return await Task.FromResult(false);
        }
        
        var department = _context.Department.FirstOrDefault(d => d.Guid == request.DepartmentId);
        
        staff.FirstName = request.FirstName;
        staff.LastName = request.LastName;
        staff.EmailId = request.EmailId;
        staff.DepartmentId = department?.Id;
        staff.Role = request.Role;
        
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteHospitalStaffAsync(Guid staffGuid)
    {
        var staff = _context.Staff.FirstOrDefault(s => s.Guid == staffGuid);
        if (staff != null)
        {
            _context.Staff.Remove(staff);
            var result = await _context.SaveChangesAsync();
            return result > 0;

        }
        
        return await Task.FromResult(false);
    }
}