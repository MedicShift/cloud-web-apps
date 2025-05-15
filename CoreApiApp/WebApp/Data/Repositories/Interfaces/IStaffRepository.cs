using CoreApiApp.Data.Entities;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Data.Repositories.Interfaces;

public interface IStaffRepository
{
    Task<List<StaffResponse>> GetAllHospitalStaffsAsync(Guid hospitalId);          
    Task<bool> CreateHospitalStaffAsync(Staff staff);
}