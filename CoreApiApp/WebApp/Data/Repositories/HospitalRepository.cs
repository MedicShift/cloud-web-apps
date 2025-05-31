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
        if (hospitals == null)
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
        var hospital = _context.Hospital.FirstOrDefault(h => h.Guid == hospitalGuid);
        var departments = await _context.Department.Where(d => d.HospitalId == hospital.Id).ToListAsync();
        
        var response = DeparmentMapper.ToResponseList(departments);
       
           if (departments == null)
           {
               throw new NotFoundException("Departments not found.");
           }
           
       return response;
    }
}