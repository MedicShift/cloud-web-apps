using CoreApiApp.Models.Requests;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Data.Repositories.Interfaces;

public interface IShiftRepository
{
    Task<List<ShiftResponse>> GetAllHospitalShiftsAsync(Guid hospitalGuid);
    Task<bool> CreateHospitalShiftAsync(CreateShiftRequest request, Guid hospitalGuid);
    Task<bool> UpdateHospitalShiftAsync(UpdateShiftRequest request);
    Task<bool> DeleteHospitalShiftAsync(Guid shiftGuid);

}