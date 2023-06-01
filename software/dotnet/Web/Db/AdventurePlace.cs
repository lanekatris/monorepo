using System;
using System.Collections.Generic;

namespace Web.Db
{
    public partial class AdventurePlace
    {
        public int Id { get; set; }
        public int AdventureId { get; set; }
        public int PlaceId { get; set; }
    }
}
