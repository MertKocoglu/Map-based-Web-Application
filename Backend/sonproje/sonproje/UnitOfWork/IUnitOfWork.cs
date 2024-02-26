namespace sonproje.Data.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IDoorRepository Doors { get; }

        void SaveChanges();
    }
}
