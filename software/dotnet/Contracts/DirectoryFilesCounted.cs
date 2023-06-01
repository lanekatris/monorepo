namespace Shared;

public class DirectoryFilesCounted
{
    public int Count { get; }
    public string Source { get; }

    public DirectoryFilesCounted(int count, string source)
    {
        Count = count;
        Source = source;
    }
}