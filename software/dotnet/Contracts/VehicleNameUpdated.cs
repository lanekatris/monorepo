namespace Shared;

public record VehicleNameUpdated(Guid VehicleId, string Name, DateTimeOffset Date, Guid UserId) : IEventDate, IUserAction
{
    
}

public class GetDiscsInput
{
    public bool? IncludeDeleted { get; set; }
}