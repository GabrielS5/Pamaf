﻿using Microsoft.AspNetCore.Mvc;
using Pamaf.Entities;
using Pamaf.Repositories.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Pamaf.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameSessionsController : ControllerBase
    {
        private readonly IUsersRepository usersRepository;
        private readonly IGameSessionsRepository gameSessionsRepository;
        public GameSessionsController(IUsersRepository usersRepository, IGameSessionsRepository gameSessionsRepository)
        {
            this.usersRepository = usersRepository;
            this.gameSessionsRepository = gameSessionsRepository;
        }

        [HttpGet()]
        public async Task<IActionResult> GetAll()
        {
            var result = (await gameSessionsRepository.GetAll()).ToList();
            result.ForEach(session => session.Levels
                                             .ForEach(f => f.GameSession = null));
            return Ok(result);
        }

        [HttpGet("latest/{id}/{year:int}")]
        public async Task<IActionResult> GetLatestSession(string id, int year)
        {
            var user = await usersRepository.GetByFacebookId(id);
            var gameSessions = await gameSessionsRepository.GetByUser(user);
            var latestSession = gameSessions.Where(w => w.Year == year && !w.Finished).OrderBy(o => o.Date).FirstOrDefault();
            if (latestSession != null)
            {
                await gameSessionsRepository.Update(latestSession);
                latestSession.Levels.ForEach(f => f.GameSession = null);

                return Ok(latestSession);

            }
            else
            {
                latestSession = new GameSession
                {
                    User = user,
                    Date = DateTime.Now,
                    Year = year,
                    Finished = false,
                    Hearts = 3,
                    Time = 0,
                    BotsEaten = 0,
                    Score = 0
                };
                await gameSessionsRepository.Create(latestSession);

                return Ok((await gameSessionsRepository.GetByUser(user)).Where(w => w.Year == year && !w.Finished).OrderBy(o => o.Date).FirstOrDefault());
            }
        }

        [HttpPost("loseHeart/{id}")]
        public async Task<IActionResult> LoseHealth(string id)
        {
            var gameSession = await gameSessionsRepository.GetById(new Guid(id));

            if (gameSession == null)
                return Ok();

            gameSession.Hearts--;
            await gameSessionsRepository.Update(gameSession);

            return Ok();
        }

        [HttpPost("finish/{id}/{score:int}")]
        public async Task<IActionResult> Finish(string id, int score)
        {
            var gameSession = await gameSessionsRepository.GetById(new Guid(id));

            if (gameSession == null)
                return Ok();

            gameSession.Finished = true;
            gameSession.Score = score;

            await gameSessionsRepository.Update(gameSession);

            return Ok();
        }

        [HttpPost("addLevel/{id}/{score:int}/{levelNumber:int}")]
        public async Task<IActionResult> AddLevel(string id, int score, int levelNumber)
        {
            var gameSession = await gameSessionsRepository.GetById(new Guid(id));

            if (gameSession == null)
                return Ok();

            gameSession.Score = score;

            await gameSessionsRepository.CreateGameLevel(new GameLevel
            {
                LevelNumber = levelNumber,
                GameSession = gameSession
            });

            await gameSessionsRepository.Update(gameSession);

            return Ok();
        }

        [HttpPost("addTime/{id}/{time:int}")]
        public async Task<IActionResult> AddTime(string id, int time)
        {
            var gameSession = await gameSessionsRepository.GetById(new Guid(id));

            if (gameSession == null)
                return Ok();

            gameSession.Time += time;

            await gameSessionsRepository.Update(gameSession);

            return Ok();
        }

        [HttpPost("addBotsEaten/{id}")]
        public async Task<IActionResult> AddBotsEaten(string id)
        {
            var gameSession = await gameSessionsRepository.GetById(new Guid(id));

            if (gameSession == null)
                return Ok();

            gameSession.BotsEaten++;

            await gameSessionsRepository.Update(gameSession);

            return Ok();
        }
    }
}
