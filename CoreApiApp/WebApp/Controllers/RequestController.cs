using CoreApiApp.Common.Exceptions;
using CoreApiApp.Common.Mappings;
using CoreApiApp.Data.Entities;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoreApiApp.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class RequestController : ControllerBase

{
    private readonly IRequestRepository _requestRepository;

    public RequestController(IRequestRepository requestRepository)
    {
        _requestRepository = requestRepository;
    }
    
    [HttpGet("All")]
    public async Task<IActionResult> GetAllRequest()
    {
        var hospitalGuid = Guid.Parse(User.FindFirst("hospital_guid")?.Value!);
        var result = await _requestRepository.GetAllRequestsAsync(hospitalGuid);
        if (result == null)
        {
            return Ok("No requests found");
        }
        return Ok(result);
    }
    
    [HttpGet("Types")]
    public async Task<IActionResult> GetRequestTypes()
    {
        var result = await _requestRepository.GetRequestTypesAsync();
        if (result == null)
        {
            return Ok("No requests types found");
        }
        return Ok(result);
    }
        
    [HttpPost("Types")]
    public async Task<ActionResult<bool>> CreateRequestType(string type, string description)
    {
        return Ok(await _requestRepository.CreateRequestTypeAsync(type, description));
    }
     
    [HttpPut("Types")]
    public async Task<ActionResult<string>> UpdateRequestType(Guid requestTypeGuid, string type, string description)
    {
        var response = await _requestRepository.UpdateRequestTypeAsync(requestTypeGuid, type, description);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to update Request Type" });
        }
        return Ok(new { success = true, message = "Request Type updated successfully" });
    }
        
    [HttpDelete("Types")]
    public async Task<ActionResult<string>> DeleteRequestType(Guid requestTypeGuid)
    {
        var response = await _requestRepository.DeleteRequestTypeAsync(requestTypeGuid);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to delete request Type" });
        }
        return Ok(new { success = true, message = "Request Type deleted successfully" });
    }
    
    [HttpGet("Leave")]
    public async Task<IActionResult> GetLeaveRequests(Guid requestTypeGuid)
    {
        var hospitalGuid = Guid.Parse(User.FindFirst("hospital_guid")?.Value!);
        var leaveRequests = await _requestRepository.GetRequestsAsync<LeaveRequest>(requestTypeGuid, hospitalGuid);
        
        var response = LeaveRequestMapper.ToResponseList(leaveRequests);
        if (!response.Any())
        {
            throw new NotFoundException("Leave requests not found.");
        }
        return Ok(response);
    }
        
    [HttpPost("Leave")]
    public async Task<ActionResult<bool>> CreateLeaveRequest(CreateLeaveRequest request)
    {
        var hospitalGuid = Guid.Parse(User.FindFirst("hospital_guid")?.Value!);
        request.RequestedBy = Guid.Parse(User.FindFirst("staff_guid")?.Value!);
        
        var leaveRequest = new LeaveRequest()
        {
            RequestTypeId = request.RequestTypeId,
            RequestedBy = request.RequestedBy,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Reason = request.Reason
        };
        
        return Ok(await _requestRepository.CreateRequestAsync(leaveRequest, hospitalGuid));
    }
     
    [HttpPut("Leave")]
    public async Task<ActionResult<string>> UpdateLeaveRequest(UpdateLeaveRequest request)
    {
        var leaveRequest = new LeaveRequest
        {
            RequestGuid = request.RequestId,
            RequestTypeId = request.RequestTypeId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Reason = request.Reason
        };
        
        var response = await _requestRepository.UpdateRequestAsync<LeaveRequest>(leaveRequest);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to update Leave request" });
        }
        return Ok(new { success = true, message = "Leave request updated successfully" });
    }
        
    [HttpDelete("Leave")]
    public async Task<ActionResult<string>> DeleteLeaveRequest(Guid requestGuid)
    {
        var response = await _requestRepository.DeleteRequestAsync<LeaveRequest>(requestGuid);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to delete Leave request" });
        }
        return Ok(new { success = true, message = "Leave request deleted successfully" });
    }

}