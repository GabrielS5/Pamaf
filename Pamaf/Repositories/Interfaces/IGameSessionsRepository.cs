using Pamaf.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pamaf.Repositories.Interfaces
{
    public interface IGameSessionsRepository
    {
        Task<IEnumerable<GameSession>> GetAll();

        Task<GameSession> GetById(Guid id);

        Task<IEnumerable<GameSession>> GetByUser(User user);

        Task Create(GameSession gameSession);

        Task CreateGameLevel(GameLevel gameLevel);

        Task Update(GameSession gameSession);
    }
}
