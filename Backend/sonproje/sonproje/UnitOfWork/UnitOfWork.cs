using PostgreSQL.Data;
using sonproje.UnitOfWork;
using System;

namespace sonproje.Data.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private IDoorRepository _doorRepository;

        public UnitOfWork(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IDoorRepository Doors
        {
            get
            {
                if (_doorRepository == null)
                {
                    _doorRepository = new DoorRepository(_dbContext);
                }
                return _doorRepository;
            }
        }

        public void SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}
