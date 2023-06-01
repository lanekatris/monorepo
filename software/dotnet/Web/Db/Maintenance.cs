using System;
using System.Collections.Generic;

namespace Web.Db
{
    public partial class Maintenance
    {
        public int Id { get; set; }
        public DateTime? Created { get; set; }
        public string Name { get; set; } = null!;
        public string Property { get; set; } = null!;
        public float? Price { get; set; }
    }
}
