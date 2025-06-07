using CoreApiApp.Common.Exceptions;
using CoreApiApp.Common.Mappings;
using CoreApiApp.Data.Entities;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace CoreApiApp.Data.Repositories;

public class HospitalRepository : IHospitalRepository
{
    private readonly ICoreDbContext _context;

    public HospitalRepository(ICoreDbContext context)
    {
        _context = context;
    }
    
    // public async Task<Hospital> GetHospitalByIdAsync(Guid hospitalGuid)
    // {
    //     var hospital = await _context.Hospital.FirstAsync(h => h.Guid == hospitalGuid);
    //     if (hospital == null)
    //     {
    //         throw new NotFoundException("Hospital not found.");
    //     }
    //     return hospital;
    // }
    
    public async Task<List<HospitalResponse>> GetAllHospitalAsync()
    {
        var hospitals = await _context.Hospital.ToListAsync();
        var response = HospitalMapper.ToResponseList(hospitals);
        if (!hospitals.Any())
        {
            throw new NotFoundException("Hospitals not found.");
        }
        return response;
    }
    
    public async Task<bool> CreateHospitalAsync(Hospital hospital)
    {
        await _context.Hospital.AddAsync(hospital);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

 
    public async Task<List<DepartmentResponse>> GetHospitalDepartmentsAsync(Guid hospitalGuid)
    { 
        var hospital = await _context.Hospital.FirstOrDefaultAsync(h => h.Guid == hospitalGuid);
        
        if (hospital == null)
        {
            throw new NotFoundException("Hospital not found.");
        }
        
        var departments = await _context.Department.Where(d => d.HospitalId == hospital.Id).ToListAsync();
        
        var response = DeparmentMapper.ToResponseList(departments);
        
        if (!departments.Any())
        {
            throw new NotFoundException("Departments not found.");
        }
           
           return response;
    }
    
    public async Task<bool> CreateHospitalDepartmentAsync(string departmentName, Guid hospitalGuid)
    {
        var hospital = _context.Hospital.FirstOrDefault(h => h.Guid == hospitalGuid);
        if (hospital == null)
        {
            return false;
        }

        var department = new Department
        {
            Name = departmentName,
            HospitalId = hospital.Id,
        };
        
        await _context.Department.AddAsync(department);

        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> UpdateHospitalDepartmentAsync(string departmentName, Guid departmentGuid)
    {
        var department = await _context.Department.FirstOrDefaultAsync(d => d.Guid == departmentGuid);

        if (department == null)
        {
            return await Task.FromResult(false);
        }
        
        department.Name = departmentName;
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }
    
    public async Task<bool> DeleteHospitalDepartmentAsync(Guid StaffId)
    {
        var department = _context.Department.FirstOrDefault(d => d.Guid == StaffId);
        
        if (department != null)
        {
            _context.Department.Remove(department);
            var result = await _context.SaveChangesAsync();
            return result > 0;

        }
        
        return await Task.FromResult(false);
    }
}