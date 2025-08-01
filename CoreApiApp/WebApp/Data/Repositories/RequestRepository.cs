using CoreApiApp.Common.Enums;
using CoreApiApp.Common.Exceptions;
using CoreApiApp.Common.Mappings;
using CoreApiApp.Data.Entities;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace CoreApiApp.Data.Repositories;

public class RequestRepository : IRequestRepository
{
    private readonly ICoreDbContext _context;
    public RequestRepository(ICoreDbContext context)
    {
        _context = context;
    }

    public async Task<List<RequestSummaryResponse>> GetAllRequestsAsync(Guid hospitalGuid)
    {
        var requests = await _context.Request.AsNoTracking()
            .Include(r => r.Staff)
                .ThenInclude(s => s.Hospital)
            .Include(r => r.RequestType)
            .Where(r => r.Staff.Hospital.Guid == hospitalGuid).ToListAsync();
        
        if (!requests.Any())
        {
            return new List<RequestSummaryResponse>();
        }
        var response = RequestMapper.ToResponseList(requests);

        return response;
    }

    public async Task<List<TResponse>> GetRequestsAsync<TResponse>(Guid requestTypeGuid, Guid hospitalGuid)
        where TResponse : class
    {
        var requestType = await _context.RequestType
            .AsNoTracking()
            .FirstOrDefaultAsync(rt => rt.Guid == requestTypeGuid);

        if (requestType == null)
            return new List<TResponse>();

        var details = await _context.Set<TResponse>()
            .Include(d => EF.Property<Request>(d, "Request"))
            .Include(d => EF.Property<Request>(d, "Request").RequestType)
            .Include(d => EF.Property<Request>(d, "Request").Staff)
            .Where(d => EF.Property<Request>(d, "Request").TypeId == requestType.Id &&
                        EF.Property<Request>(d, "Request").Staff.Hospital.Guid == hospitalGuid)
            .ToListAsync();

        return details;
    
    }

    public async Task<bool> CreateRequestAsync <TRequest>(TRequest req, Guid hospitalGuid)
        where TRequest: class, IRequestDetails
    {
        var requestType = await _context.RequestType.AsNoTracking().FirstOrDefaultAsync(rt => rt.Guid == req.RequestTypeId);
        if (requestType == null) throw new InvalidOperationException("Invalid request type.");

        var requester = await _context.Staff.AsNoTracking().FirstOrDefaultAsync(s => s.Guid == req.RequestedBy);
        if (requester == null) throw new InvalidOperationException("Invalid requester.");

        
        var request = new Request()
        {
            TypeId = requestType.Id,
            RequestedBy = requester.Id,
            Status = (int) RequestStatus.Pending
        };
        
        await _context.Request.AddAsync(request);
        await _context.SaveChangesAsync();
        
        req.RequestId = request.Id;
        req.ReviewedBy = 1;
        
        await _context.Set<TRequest>().AddAsync(req);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    
    public async Task<bool>  UpdateRequestAsync<TRequest>(TRequest req)
        where TRequest : class, IRequestDetails
    {
        var request = await _context.Request.FirstOrDefaultAsync(rt => rt.Guid == req.RequestGuid);
        var requestType = await _context.RequestType.AsNoTracking().FirstOrDefaultAsync(rt => rt.Guid == req.RequestTypeId);
        
        if (requestType == null)
        {
            return false;
        }

        if (request != null)
        {
            request.TypeId = requestType.Id;

            var requestDetails = await _context.Set<TRequest>()
                .FirstOrDefaultAsync(lr => lr.RequestId == request.Id);

            if (requestDetails == null)
            {
                return false;
            }

            requestDetails.StartDate = req.StartDate;
            requestDetails.EndDate = req.EndDate;
            requestDetails.Reason = req.Reason;
        }

        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteRequestAsync<TRequest>(Guid requestGuid)
        where TRequest : class, IRequestDetails
    {
        var request = await _context.Request.FirstOrDefaultAsync(r => r.Guid == requestGuid);
        if (request == null)
            return false;

        var detail = await _context.Set<TRequest>()
            .FirstOrDefaultAsync(d => EF.Property<int>(d, "RequestId") == request.Id);
        
        if (detail == null)
            return false;

        _context.Request.Remove(request);
        _context.Set<TRequest>().Remove(detail);

        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<List<RequestTypesResponse>> GetRequestTypesAsync()
    {
        var requestTypes = await _context.RequestType.AsNoTracking().ToListAsync();

        if (!requestTypes.Any())
        {
            return new List<RequestTypesResponse>();
        }
        
        var response = RequestTypeMapper.ToResponseList(requestTypes);
        
        return response;
    }

    public async Task<bool> CreateRequestTypeAsync(string type, string description)
    {
        var exists = await _context.RequestType.AnyAsync(rt => rt.Type == type);
        if (exists)
        {
            throw new ConflictException("A request type with the same name already exists.");
        }
        
        var requestType = new RequestType
        {
            Type = type,
            Description = description
        };
        await _context.RequestType.AddAsync(requestType);
        
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> UpdateRequestTypeAsync(Guid requestTypeGuid, string type, string description)
    {
        var requestType = await _context.RequestType.FirstOrDefaultAsync(rt => rt.Guid == requestTypeGuid);
        
        if (requestType == null)
        {
            return false;
        }
        
        var exists = await _context.RequestType.AnyAsync(rt => rt.Type == type && rt.Guid != requestTypeGuid );
        if (exists)
        {
            throw new ConflictException("A request type with the same name already exists.");
        }
        
        requestType.Type = type;
        requestType.Description = description;
        
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteRequestTypeAsync(Guid requestTypeGuid)
    {
        var requestType = await _context.RequestType.FirstOrDefaultAsync(rt => rt.Guid == requestTypeGuid);

        if (requestType != null)
        {
            _context.RequestType.Remove(requestType);
            var result = await _context.SaveChangesAsync();
            return result > 0;    
        }

        return false;
    }
}