using MediatR;
using Shared;

namespace Web;

public class HealthTasksQueried : INotification
{
    public List<TaskDto> Tasks { get; }

    public HealthTasksQueried(List<TaskDto> tasks)
    {
        Tasks = tasks;
    }
}