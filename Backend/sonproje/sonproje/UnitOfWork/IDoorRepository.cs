using System;
using System.Collections.Generic;
using sonproje.Models;

namespace sonproje.Data.Repositories
{
    public interface IDoorRepository : IDisposable
    {
        IEnumerable<Door> GetAllDoors();
        Response GetDoorById(int id);
        Response AddDoor(Coordinate coordinates);
        Response UpdateDoor(int id, UpdateDoorRequest updateRequest);
        Response DeleteDoor(int id);
    }
}
