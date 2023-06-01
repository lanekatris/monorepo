using System;
using System.Collections.Generic;

namespace Web.Db
{
    public partial class Adventure
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public string Name { get; set; } = null!;
        public string? Activities { get; set; }
        public string? Notes { get; set; }
    }
}
