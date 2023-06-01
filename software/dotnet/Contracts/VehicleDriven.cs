namespace Shared;
public interface IUserAction
{
    public Guid UserId { get; }
}

public interface IEventDate
{
    DateTimeOffset Date { get; }
}

public record VehicleDriven(Guid VehicleId, Guid UserId, DateTimeOffset Date) : IEventDate, IUserAction
{
    public override string ToString()
    {
        return $"Vehicle driven by {UserId} on {Date}";
    }
}

public record VehicleNeedsDriven(Guid VehicleId, string VehicleName, DateTimeOffset Date) : IEventDate;