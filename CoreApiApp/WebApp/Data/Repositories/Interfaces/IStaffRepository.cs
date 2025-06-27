using CoreApiApp.Common.Enums;
using CoreApiApp.Models.Requests;
using CoreApiApp.Models.Responses;
using Sieve.Models;

namespace CoreApiApp.Data.Repositories.Interfaces;

public interface IStaffRepository
{
    Task<StaffResponse> GetAllHospitalStaffsAsync(SieveModel sieveModel, Guid hospitalId);          
    Task<bool> CreateHospitalStaffAsync(CreateStaffRequest staff);
    Task<bool> UpdateHospitalStaffAsync(UpdateStaffRequest staff);
    Task<bool> DeleteHospitalStaffAsync(Guid StaffId);
    Task<List<DesignationResponse>> GetStaffDesignationsAsync(Guid hospitalGuid);
    Task<List<ScheduleResponse>> GetStaffScheduleAsync(Guid staffId, string startDate, string endDate);
    Task<bool> CreateScheduleAsync(CreateScheduleRequest request);
    Task<bool> UpdateScheduleAsync(UpdateScheduleRequest request);
    Task<bool> DeleteScheduleAsync(Guid scheduleGuid);
    Task<bool> AddStaffRoleAsync(Role role, Guid staffId);
    Task<bool> DeleteStaffRoleAsync(Guid roleGuid);


}