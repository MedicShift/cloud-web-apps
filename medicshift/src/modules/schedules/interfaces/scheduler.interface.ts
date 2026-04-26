export interface ISchedulerService {
  generateSchedule(scheduleId: string): Promise<boolean>;
}
