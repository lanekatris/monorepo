using System;
using System.Collections.Generic;

namespace Web.Db
{
    public partial class AttributedPlace
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Tags { get; set; }
        public bool? Visited { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Zip { get; set; }
        public int? Elevation { get; set; }
        public string? Notes { get; set; }
        public int IsStatePark { get; set; }
    }
}
