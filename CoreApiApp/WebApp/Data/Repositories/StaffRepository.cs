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
            .Include(s => s.Designation)
            .Where(s => s.IsAdmin == false)
            .Where(s => s.Hospital.Guid == hospitaGuid).AsNoTracking();
        
        var filteredQuery  = _sieveProcessor.Apply(sieveModel, query, applyPagination: false);
        var count =  await filteredQuery.CountAsync();
        
        var pagedQuery  = _sieveProcessor.Apply(sieveModel, filteredQuery , applyPagination: true);
        
        if (pagedQuery  == null)
        {
            return new StaffResponse();
        }
        
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
            return false;
        }
        var normalizedTitle = request.Designation.Trim().ToLowerInvariant();

        var designation = await _context.Designation.FirstOrDefaultAsync(d => d.Title.ToLower() == normalizedTitle);
        var hospital = _context.Hospital.FirstOrDefault(h => h.Guid == request.HospitalId);
        var department = _context.Department.FirstOrDefault(d => d.Guid == request.DepartmentId);
        var password = "password";
    
        if (designation == null)
        {
            designation = new Designation
            {
                Title = request.Designation,
            };
            await _context.Designation.AddAsync(designation);
            await _context.SaveChangesAsync();
            
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
        var staff = await _context.Staff.FirstOrDefaultAsync(s => s.Guid == request.StaffGuid);
        
        if (staff == null)
        {
            return await Task.FromResult(false);
        }
        var normalizedTitle = request.Designation.Trim().ToLowerInvariant();

        var designation = await _context.Designation.FirstOrDefaultAsync(d => d.Title.ToLower() == normalizedTitle);
        var department = await _context.Department.FirstOrDefaultAsync(d => d.Guid == request.DepartmentId);
        var hospital = _context.Hospital.FirstOrDefault(h => h.Guid == request.HospitalGuid);
        
        if (designation == null)
        {
            designation = new Designation
            {
                Title = request.Designation,
            };
            await _context.Designation.AddAsync(designation);
            await _context.SaveChangesAsync();
            
        }
        staff.FirstName = request.FirstName;
        staff.LastName = request.LastName;
        staff.EmailId = request.EmailId;
        staff.DepartmentId = department?.Id;
        staff.DesignationId = designation.Id;
        
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
    
    public async Task<List<DesignationResponse>> GetStaffDesignationsAsync(Guid hospitalGuid)
    { 
        var designations = await _context.Designation.ToListAsync();
        
        var response = DesignationMapper.ToResponseList(designations);
       
        if (designations == null)
        {
            throw new NotFoundException("Designations not found.");
        }
           
        return response;
    }
    
    public async Task<ScheduleResponse> GetSchedulesAsync(SieveModel sieveModel, Guid hospitalGuid)
    {
        
        var query =  _context.Schedule
            .Include(s => s.Staff)
            .Include(s => s.Shift)
            .Include(s => s.Department)
                .ThenInclude(d => d.Hospital)
            .Where(s => s.Department.Hospital.Guid == hospitalGuid)
            .AsNoTracking();
        
        var filteredQuery  = _sieveProcessor.Apply(sieveModel, query, applyPagination: false);
        var count = await filteredQuery.CountAsync();
        
        var pagedQuery  = _sieveProcessor.Apply(sieveModel, filteredQuery , applyPagination: true);
        
        if (pagedQuery == null)
        {
            return new ScheduleResponse();
        }
        
        var response = new ScheduleResponse()
        {
            Schedules = await pagedQuery.Select(s => ScheduleMapper.ToResponse(s)).ToListAsync(),
            TotalCount = count
        };
        
        return response;
    }
    
    public async Task<bool> CreateScheduleAsync(CreateScheduleRequest request)
    {

        var staff = _context.Staff.FirstOrDefault(s => s.Guid == request.StaffGuid);
        var shift = _context.Shift.FirstOrDefault(s => s.Guid == request.ShiftGuid);
        var department = _context.Department.FirstOrDefault(d => d.Guid == request.DepartmentGuid);

        if (staff == null || shift == null || department == null)
        {
            return await Task.FromResult(false);
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
        var schedule = await _context.Schedule.FirstOrDefaultAsync(s => s.Guid == request.ScheduleGuid);
        var staff = _context.Staff.FirstOrDefault(s => s.Guid == request.StaffGuid);
        var shift = _context.Shift.FirstOrDefault(s => s.Guid == request.ShiftGuid);
        var department = _context.Department.FirstOrDefault(d => d.Guid == request.DepartmentGuid);
        
        if (schedule == null || staff == null || shift == null || department == null)
        {
            return await Task.FromResult(false);
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
        var schedule = _context.Schedule.FirstOrDefault(s => s.Guid == scheduleGuid);
        if (schedule != null)
        {
            _context.Schedule.Remove(schedule);
            var result = await _context.SaveChangesAsync();
            return result > 0;

        }
        
        return await Task.FromResult(false);
    }
}