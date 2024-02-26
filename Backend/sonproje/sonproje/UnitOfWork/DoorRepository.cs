using Microsoft.EntityFrameworkCore;
using PostgreSQL.Data;
using sonproje.UnitOfWork;
using sonproje.Data.Repositories;
using sonproje.Models;

namespace sonproje.UnitOfWork
{
    public class DoorRepository : IDoorRepository
    {

        private readonly AppDbContext _dbContext;

        public DoorRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public Response AddDoor(Coordinate coordinates)
        {
            Response response = new Response();

            try
            {
                var door = new Door
                {
                    name = coordinates.name,
                    x = coordinates.x,
                    y = coordinates.y
                };

                _dbContext.doors.Add(door);
                _dbContext.SaveChanges();

                response.Data = door;
                response.isSuccess = true;
                response.Message = "Successfully added";
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }

            return response;
        }

        public Response DeleteDoor(int id)
        {
            Response response = new Response();

            try
            {
                var door = _dbContext.doors.Find(id);

                if (door != null)
                {
                    _dbContext.doors.Remove(door);
                    _dbContext.SaveChanges();

                    response.Message = "Successfully deleted";
                    response.isSuccess = true;
                }
                else
                {
                    response.Message = "Door not found";
                    response.isSuccess = false;
                }
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }

            return response;
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Door> GetAllDoors()
        {
            List<Door> doors = new List<Door>();

            try
            {
                doors = _dbContext.doors.ToList();
            }
            catch (Exception ex)
            {
                // Handle exceptions
            }

            return doors;
        }

        public Response GetDoorById(int id)
        {
            Response response = new Response();

            try
            {
                var door = _dbContext.doors.Find(id);

                if (door != null)
                {
                    response.Data = door;
                    response.Message = "Door found";
                    response.isSuccess = true;
                }
                else
                {
                    response.Message = "Door not found";
                    response.isSuccess = false;
                }
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }

            return response;
        }

        public Response UpdateDoor(int id, UpdateDoorRequest updateRequest)
        {
            Response response = new Response();

            try
            {
                var door = _dbContext.doors.Find(id);

                if (door != null)
                {
                    if (updateRequest.NewX != 0)
                    {
                        door.x = updateRequest.NewX;
                    }
                    if (updateRequest.NewY != 0)
                    {
                        door.y = updateRequest.NewY;
                    }
                    if (!string.IsNullOrEmpty(updateRequest.NewName) && updateRequest.NewName != "string")
                    {
                        door.name = updateRequest.NewName;
                    }

                    _dbContext.SaveChanges();

                    response.Message = "Door Updated";
                    response.isSuccess = true;
                    response.Data = updateRequest;
                }
                else
                {
                    response.Message = "Door not found";
                    response.isSuccess = false;
                }
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }

            return response;
        }


    }
}
