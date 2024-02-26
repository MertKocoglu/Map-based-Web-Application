using Microsoft.AspNetCore.Mvc;
using sonproje.Models;
using sonproje.Data.Repositories;
using sonproje.UnitOfWork;
using System.Collections;
using System.Web.Http.Cors;

namespace stajproje4.Controllers
{
    [EnableCors(origins: "http://127.0.0.1:5501", headers: "*", methods: "*")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DoorController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public DoorController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost]
        public Response Add(Coordinate coordinates)
        {
            var response = _unitOfWork.Doors.AddDoor(coordinates);
            _unitOfWork.SaveChanges();
            return response;
        }

        [HttpGet("{id}")]
        public Response GetById(int id)
        {
            var response = _unitOfWork.Doors.GetDoorById(id);

            if (!response.isSuccess)
            {
                return response;
            }

            return response;
        }

        [HttpDelete("{id}")]
        public Response Delete(int id)
        {
            var response = _unitOfWork.Doors.DeleteDoor(id);

            if (!response.isSuccess)
            {
                return response;
            }

            _unitOfWork.SaveChanges();

            return response;
        }

        [HttpPut("{id}")]
        public Response UpdateData(int id, UpdateDoorRequest updateRequest)
        {
            var response = _unitOfWork.Doors.UpdateDoor(id, updateRequest);

            if (!response.isSuccess)
            {
                return response;
            }

            _unitOfWork.SaveChanges();

            return response;
        }

        [HttpGet]
        public IEnumerable GetAll()
        {
            var doors = _unitOfWork.Doors.GetAllDoors();
            return doors;
        }
    }
}
