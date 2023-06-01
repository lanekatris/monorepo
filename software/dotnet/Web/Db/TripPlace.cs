using System;
using System.Collections.Generic;

namespace Web.Db
{
    public partial class TripPlace
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public int PlaceId { get; set; }
    }
}
