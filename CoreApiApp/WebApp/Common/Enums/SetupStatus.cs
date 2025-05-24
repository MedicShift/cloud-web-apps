namespace CoreApiApp.Common.Enums;

public enum SetupStatus : byte
{
    NotStarted = 0,
    BasicInfoCompleted = 1,
    DepartmentsAdded = 2,
    StaffInvited = 3,
    ShiftsConfigured = 4,
    ReadyToUse = 5
}
