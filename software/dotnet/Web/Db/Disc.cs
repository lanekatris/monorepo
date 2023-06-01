using System;
using System.Collections.Generic;

namespace Web.Db
{
    public partial class Disc
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public int? Number { get; set; }
        public string? Color { get; set; }
        public string? Status { get; set; }
        public string Tags { get; set; } = null!;
        public string Type { get; set; } = null!;
        public decimal? Price { get; set; }
        public int? Weight { get; set; }
        public DateOnly? RealCreatedDate { get; set; }
    }
}
