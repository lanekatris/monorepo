using System;
using System.Collections.Generic;

namespace Web.Db
{
    public partial class Feed
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public string Type { get; set; } = null!;
        public string? Message { get; set; }
        public string? Data { get; set; }
        public string Tags { get; set; } = null!;
    }
}
