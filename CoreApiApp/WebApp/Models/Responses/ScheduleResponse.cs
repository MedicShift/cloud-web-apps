namespace CoreApiApp.Models.Responses;

public class ScheduleResponse
{
    public required List<ScheduleViewModel> Schedules { get; set; }
    public int TotalCount { get; set; }
}