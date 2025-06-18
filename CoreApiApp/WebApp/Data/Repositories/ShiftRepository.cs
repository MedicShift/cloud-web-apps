using CoreApiApp.Common.Exceptions;
using CoreApiApp.Common.Mappings;
using CoreApiApp.Data.Entities;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Requests;
using CoreApiApp.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace CoreApiApp.Data.Repositories;

public class ShiftRepository : IShiftRepository
{
    private readonly ICoreDbContext _context;

    public ShiftRepository(ICoreDbContext context)
    {
        _context = context;
    }
    public async Task<List<ShiftResponse>> GetAllHospitalShiftsAsync(Guid hospitalGuid)
    {
        var hospital = _context.Hospital.FirstOrDefault(h => h.Guid == hospitalGuid);
        if (hospital == null) throw new NotFoundException("Hospital not found.");

        var shifts = await _context.Shift.Where(sh => sh.HospitalId == hospital.Id)
            .AsNoTracking()
            .ToListAsync();

        if (!shifts.Any())
        {
            throw new NotFoundException("Shifts not found.");
        }
        var response = ShiftMapper.ToResponseList(shifts);

        return response;
    }

    public async Task<bool> CreateHospitalShiftAsync(CreateShiftRequest request, Guid hospitalGuid)
    {
        var hospital = await _context.Hospital.FirstOrDefaultAsync(h => h.Guid == hospitalGuid);
        if (hospital == null) throw new NotFoundException("Hospital not found.");
        
        var exists = await _context.Shift.AnyAsync(s => s.ShiftType == request.ShiftType && s.HospitalId == hospital.Id);
        if (exists)
        {
            throw new ConflictException("A shift type with the same name already exists.");
        }

        var shift = new Shift()
        {
            ShiftType = request.ShiftType,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            HospitalId = hospital.Id,
        };
        await _context.Shift.AddAsync(shift);

        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> UpdateHospitalShiftAsync(UpdateShiftRequest request)
    {
        var shift = await _context.Shift.FirstOrDefaultAsync(d => d.Guid == request.ShiftId);

        if (shift == null)
        {
            return false;
        }
        
        var exists = await _context.Shift.AnyAsync(s =>
            s.ShiftType == request.ShiftType &&
            s.HospitalId == shift.HospitalId &&
            s.Guid != request.ShiftId);        
        if (exists)
        {
            throw new ConflictException("A shift type with the same name already exists.");
        }
        
        shift.ShiftType = request.ShiftType;
        shift.StartTime = request.StartTime;
        shift.EndTime = request.EndTime;
        
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteHospitalShiftAsync(Guid shiftGuid)
    {
        var shift = await _context.Shift.FirstOrDefaultAsync(d => d.Guid == shiftGuid);
        
        if (shift != null)
        {
            _context.Shift.Remove(shift);
            var result = await _context.SaveChangesAsync();
            return result > 0;

        }
        
        return false;
    }
}