namespace Shared;

public class TaskDto
{
    public bool Done { get; }
    public string Task { get; }

    public TaskDto(bool done, string task)
    {
        Done = done;
        Task = task;
    }
}

public class HealthStatusUpdated
{
    public List<TaskDto> TaskList { get; }

    public HealthStatusUpdated(List<TaskDto> taskList)
    {
        TaskList = taskList;
    }
}