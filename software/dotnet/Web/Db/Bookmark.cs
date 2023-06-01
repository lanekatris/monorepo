using System;
using System.Collections.Generic;

namespace Web.Db
{
    public partial class Bookmark
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public string? Name { get; set; }
        public string? Tags { get; set; }
        public string? Meta { get; set; }
        public string? ImageUrl { get; set; }
        public string? Url { get; set; }
        public string? Status { get; set; }
    }
}
