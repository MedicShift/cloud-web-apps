using CoreApiApp.Data.Entities;
using CoreApiApp.Models;
using CoreApiApp.Models.Requests;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Data.Repositories.Interfaces;

public interface IRequestRepository
{
    Task<List<RequestSummaryResponse>> GetAllRequestsAsync(Guid hospitalGuid);
    Task<List<TResponse>> GetRequestsAsync<TResponse>(Guid requestTypeGuid, Guid hospitalGuid)
        where TResponse : class;
    Task<bool> CreateRequestAsync<TRequest>(TRequest req, Guid hospitalGuid)
        where TRequest : class, IRequestDetails;
    Task<bool> UpdateRequestAsync<TRequest>(TRequest request)
        where TRequest : class, IRequestDetails;
    Task<bool> DeleteRequestAsync<TRequest>(Guid requestGuid)
         where TRequest : class, IRequestDetails;
    Task<List<RequestTypesResponse>> GetRequestTypesAsync();
    Task<bool> CreateRequestTypeAsync(string type, string description);
    Task<bool> UpdateRequestTypeAsync(Guid requestTypeGuid, string type, string description);
    Task<bool> DeleteRequestTypeAsync(Guid requestGuid);
}