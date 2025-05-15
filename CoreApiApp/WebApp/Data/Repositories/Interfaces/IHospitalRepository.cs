using CoreApiApp.Data.Entities;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Data.Repositories.Interfaces;

public interface IHospitalRepository
{
    // Task<Hospital> GetHospitalByIdAsync(Guid hospitalGuid);
    Task<List<HospitalResponse>> GetAllHospitalAsync();          
    Task<bool> CreateHospitalAsync(Hospital hospital);
    // Task UpdateHospitalAsync(Hospital hospital);
    // Task DeleteHospitalAsync(int id);
}