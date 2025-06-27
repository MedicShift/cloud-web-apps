using CoreApiApp.Common.Enums;
using CoreApiApp.Common.Exceptions;
using CoreApiApp.Common.Mappings;
using CoreApiApp.Data.Entities;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models;
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
    
    
    public async Task<StaffResponse> GetAllHospitalStaffsAsync(SieveModel sieveModel, Guid hospitalGuid)
    {
        var query = _context.Staff
            .Include(s => s.Hospital)
            .Include(s => s.Department)
            .Include(s => s.Designation)
            .Include(s => s.StaffRoles)
            .Where(s =>
                !s.StaffRoles.Any(r => r.Role == Role.SuperAdmin || r.Role == Role.HospitalAdmin) &&
                s.Hospital.Guid == hospitalGuid)
            .AsNoTracking();
        
        var filteredQuery  = _sieveProcessor.Apply(sieveModel, query, applyPagination: false);
        
        var count = await filteredQuery.CountAsync();
        if (count == 0)
        {
            return new StaffResponse { Staffs = new List<StaffViewModel>(), TotalCount = 0 };
        }
        
        var pagedQuery  = _sieveProcessor.Apply(sieveModel, filteredQuery , applyPagination: true);
        
        var response = new StaffResponse()
        {
            Staffs = await pagedQuery.Select(s => StaffMapper.ToResponse(s)).ToListAsync(),
            TotalCount = count
        };
        
        return response;
    }

    public async Task<bool> CreateHospitalStaffAsync(CreateStaffRequest request)
    {
        if (await _context.Staff.AnyAsync(s => s.EmailId == request.EmailId))
        {
            throw new ConflictException("A user with the email already exists.");
        }
        var normalizedTitle = request.Designation.Trim().ToLowerInvariant();

        var designation = await _context.Designation.FirstOrDefaultAsync(d => d.Title.ToLower() == normalizedTitle);
        var hospital = await _context.Hospital.FirstOrDefaultAsync(h => h.Guid == request.HospitalId);
        var department = await _context.Department.FirstOrDefaultAsync(d => d.Guid == request.DepartmentId);
        var password = "password";

        if (hospital == null)
        {
            throw new NotFoundException("Hospital not found.");
        }
        
        if (designation == null)
        {
            designation = new Designation
            {
                Title = request.Designation,
            };
            await _context.Designation.AddAsync(designation);
        }
        
        var staff = new Staff();
        var hashedPassword = new PasswordHasher<Staff>()
            .HashPassword(staff, password);

        staff.EmailId = request.EmailId;
        staff.FirstName = request.FirstName;
        staff.LastName = request.LastName;
        staff.HospitalId = hospital.Id;
        staff.DepartmentId = department?.Id;
        staff.DesignationId = designation.Id;
        staff.PasswordHash = hashedPassword;
        
        await _context.Staff.AddAsync(staff);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> UpdateHospitalStaffAsync(UpdateStaffRequest request)
    {
        var staff = await _context.Staff.FirstOrDefaultAsync(s => s.Guid == request.StaffId);
        
        if (staff == null)
        {
            return false;
        }
        var normalizedTitle = request.Designation.Trim().ToLowerInvariant();

        var designation = await _context.Designation.FirstOrDefaultAsync(d => d.Title.ToLower() == normalizedTitle);
        var department = await _context.Department.FirstOrDefaultAsync(d => d.Guid == request.DepartmentId);
        
        if (await _context.Staff.AnyAsync(s => s.EmailId == request.EmailId && s.Guid != request.StaffId))
        {
            throw new ConflictException("A user with the email already exists.");
        }
        
        if (designation == null)
        {
            designation = new Designation
            {
                Title = request.Designation,
            };
            await _context.Designation.AddAsync(designation);
        }
        staff.FirstName = request.FirstName;
        staff.LastName = request.LastName;
        staff.EmailId = request.EmailId;
        staff.DepartmentId = department?.Id;
        staff.DesignationId = designation.Id;
        
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteHospitalStaffAsync(Guid staffId)
    {
        var staff = await _context.Staff.FirstOrDefaultAsync(s => s.Guid == staffId);
        if (staff != null)
        {
            _context.Staff.Remove(staff);
            var result = await _context.SaveChangesAsync();
            return result > 0;

        }
        
        return false;
    }
    
    public async Task<List<DesignationResponse>> GetStaffDesignationsAsync(Guid hospitalGuid)
    { 
        var designations = await _context.Designation.AsNoTracking().ToListAsync();
        
       
        if (!designations.Any())
        {
            throw new NotFoundException("Designations not found.");
        }
        
        var response = DesignationMapper.ToResponseList(designations);
           
        return response;
    }
    
    
    public async Task<List<ScheduleResponse>> GetStaffScheduleAsync(Guid staffId, string startDate, string endDate)
    {
        
        var schedules =  await _context.Schedule
            .Include(s => s.Staff)
            .Include(s => s.Shift)
            .Include(s => s.Department)
            .Where(s => 
                    s.Staff.Guid == staffId && 
                    s.ScheduledDate.CompareTo(startDate)  >= 0 &&
                    s.ScheduledDate.CompareTo(endDate) <= 0)
            .AsNoTracking().ToListAsync();

        if (!schedules.Any())
        {
            return new List<ScheduleResponse>();
        }
        var response = ScheduleMapper.ToResponseList(schedules);
        return response;
    }
    
    public async Task<bool> CreateScheduleAsync(CreateScheduleRequest request)
    {

        var staff = await _context.Staff.FirstOrDefaultAsync(s => s.Guid == request.StaffId);
        var shift = await _context.Shift.FirstOrDefaultAsync(s => s.Guid == request.ShiftId);
        var department = await _context.Department.FirstOrDefaultAsync(d => d.Guid == request.DepartmentGuid);

        if (staff == null || shift == null || department == null)
        {
            return false;
        }

        var schedule = new Schedule()
        {
            StaffId = staff.Id,
            ShiftId = shift.Id,
            DepartmentId = department.Id,
            ScheduledDate = request.ScheduleDate
        };
        
        await _context.Schedule.AddAsync(schedule);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> UpdateScheduleAsync(UpdateScheduleRequest request)
    {
        var schedule = await _context.Schedule.FirstOrDefaultAsync(s => s.Guid == request.ScheduleId);
        var staff = await _context.Staff.FirstOrDefaultAsync(s => s.Guid == request.StaffId);
        var shift = await _context.Shift.FirstOrDefaultAsync(s => s.Guid == request.ShiftId);
        var department = await _context.Department.FirstOrDefaultAsync(d => d.Guid == request.DepartmentGuid);
        
        if (schedule == null || staff == null || shift == null || department == null)
        {
            return false;
        }

        schedule.StaffId = staff.Id;
        schedule.ShiftId = shift.Id;
        schedule.DepartmentId = department.Id;
        schedule.ScheduledDate = request.ScheduleDate;
        
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }
    
    public async Task<bool> DeleteScheduleAsync(Guid scheduleGuid)
    {
        var schedule = await _context.Schedule.FirstOrDefaultAsync(s => s.Guid == scheduleGuid);
        if (schedule != null)
        {
            _context.Schedule.Remove(schedule);
            var result = await _context.SaveChangesAsync();
            return result > 0;

        }
        
        return false;
    }
    
    public async Task<bool> AddStaffRoleAsync(Role role, Guid staffId)
    {
        var staff = await _context.Staff.FirstOrDefaultAsync(s => s.Guid == staffId);

        if (staff == null )
        {
            return false;
        }

        var staffRole = new StaffRole()
        {
            StaffId = staff.Id,
            Role = role
        };
        
        await _context.StaffRole.AddAsync(staffRole);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteStaffRoleAsync(Guid roleGuid)
    {
        var staffRole = await _context.StaffRole.FirstOrDefaultAsync(s => s.Guid == roleGuid);
        if (staffRole != null)
        {
            _context.StaffRole.Remove(staffRole);
            var result = await _context.SaveChangesAsync();
            return result > 0;

        }
        
        return false;
    }
}