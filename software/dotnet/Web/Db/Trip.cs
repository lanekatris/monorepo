using System;
using System.Collections.Generic;

namespace Web.Db
{
    public partial class Trip
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Url { get; set; }
        public DateTime Created { get; set; }
        public string? Tags { get; set; }
    }
}
