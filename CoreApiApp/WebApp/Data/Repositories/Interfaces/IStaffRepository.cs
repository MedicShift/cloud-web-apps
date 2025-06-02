using CoreApiApp.Data.Entities;
using CoreApiApp.Models.Requests;
using CoreApiApp.Models.Responses;
using Sieve.Models;

namespace CoreApiApp.Data.Repositories.Interfaces;

public interface IStaffRepository
{
    Task<StaffResponse> GetAllHospitalStaffsAsync(SieveModel sieveModel, Guid hospitalId);          
    Task<bool> CreateHospitalStaffAsync(CreateStaffRequest staff);
    Task<bool> UpdateHospitalStaffAsync(UpdateStaffRequest staff);
    Task<bool> DeleteHospitalStaffAsync(Guid staffGuid);
    Task<List<DesignationResponse>> GetStaffDesignationsAsync(Guid hospitalGuid);

}