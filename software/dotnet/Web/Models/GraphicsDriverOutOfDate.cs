using MediatR;
using Shared;

namespace Web;

public class GraphicsDriverOutOfDate : INotification
{
    public GraphicsDriverRead Ev { get; }

    public GraphicsDriverOutOfDate(GraphicsDriverRead ev)
    {
        Ev = ev;
    }
}