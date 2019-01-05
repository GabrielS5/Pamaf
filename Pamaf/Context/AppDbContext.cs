using Microsoft.EntityFrameworkCore;
using Pamaf.Entities;

namespace Pamaf.Context
{
    public sealed class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
            Database.Migrate();
        }

        public DbSet<User> Users { get; set; }

        public DbSet<GameSession> GameSessions { get; set; }

        public DbSet<GameLevel> GameLevels { get; set; }
    }
}
