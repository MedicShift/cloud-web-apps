namespace CoreApiApp.Models.Responses;

public class ScheduleResponse
{
    public List<ScheduleViewModel> Schedules { get; set; }
    public int TotalCount { get; set; }
}