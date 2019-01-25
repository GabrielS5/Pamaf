using Microsoft.EntityFrameworkCore;
using Pamaf.Context;
using Pamaf.Entities;
using Pamaf.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pamaf.Repositories.Implementations
{
    public class GameSessionsRepository : IGameSessionsRepository
    {
        private readonly AppDbContext appDbContext;
        public GameSessionsRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public async Task Create(GameSession gameSession)
        {
            await appDbContext.Set<GameSession>().AddAsync(gameSession);

            await appDbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<GameSession>> GetAll()
        {
            return await appDbContext.Set<GameSession>()
                                     .Include(i => i.User)
                                     .Include(i => i.Levels)
                                     .ToListAsync();
        }

        public async Task<IEnumerable<GameSession>> GetByUser(User user)
        {
            return await appDbContext.Set<GameSession>()
                                     .Include(i => i.User)
                                     .Include(i => i.Levels)
                                     .Where(w => w.User.Id == user.Id).ToListAsync();
        }

        public async Task<GameSession> GetById(Guid id)
        {
            return await appDbContext.Set<GameSession>()
                                     .Include(i => i.User)
                                     .Include(i => i.Levels)
                                     .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task Update(GameSession gameSession)
        {
            var item = await GetById(gameSession.Id);

            item.Date = DateTime.Now;
            item.Finished = gameSession.Finished;
            item.Hearts = gameSession.Hearts;
            item.Score = gameSession.Score;
            item.BotsEaten = gameSession.BotsEaten;
            item.Time = gameSession.Time;

            await appDbContext.SaveChangesAsync();
        }

        public async Task CreateGameLevel(GameLevel gameLevel)
        {
            await appDbContext.Set<GameLevel>().AddAsync(gameLevel);

            await appDbContext.SaveChangesAsync();
        }
    }
}
