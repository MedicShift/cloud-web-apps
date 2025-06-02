using CoreApiApp.Data.Entities;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Data.Repositories.Interfaces;

public interface IHospitalRepository
{
    // Task<Hospital> GetHospitalByIdAsync(Guid hospitalGuid);
    Task<List<HospitalResponse>> GetAllHospitalAsync();          
    Task<bool> CreateHospitalAsync(Hospital hospital);
    Task<List<DepartmentResponse>> GetHospitalDepartmentsAsync(Guid hospitalGuid);
    Task<bool> CreateHospitalDepartmentAsync(string departmentName, Guid hospitalGuid);
    Task<bool> UpdateHospitalDepartmentAsync(string departmentName, Guid departmentGuid);
    Task<bool> DeleteHospitalDepartmentAsync(Guid departmentGuid);



    // Task UpdateHospitalAsync(Hospital hospital);
    // Task DeleteHospitalAsync(int id);
}