using Microsoft.AspNetCore.Mvc;
using Pamaf.Entities;
using Pamaf.Repositories.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Pamaf.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository usersRepository;
        private readonly IGameSessionsRepository gameSessionsRepository;
        public UsersController(IUsersRepository usersRepository, IGameSessionsRepository gameSessionsRepository)
        {
            this.usersRepository = usersRepository;
            this.gameSessionsRepository = gameSessionsRepository;
        }

        [HttpGet("{id}/{name}")]
        public async Task<IActionResult> Login(string id, string name)
        {
            var user = await usersRepository.GetByFacebookId(id);
            if (user == null)
            {
                user = new User
                {
                    FacebookId = id,
                    FacebookName = name
                };

                await usersRepository.Create(user);

                return Ok(user);
            }
            return Ok(user);
        }

        [HttpGet("changeName/{id}/{name}")]
        public async Task<IActionResult> ChangeName(string id, string name)
        {
            var user = await usersRepository.GetByFacebookId(id);
            user.FacebookName = name;

            await usersRepository.Update(user);

            return Ok();
        }

        [HttpGet("{id}/year")]
        public async Task<IActionResult> GetYear(string id)
        {
            var user = await usersRepository.GetByFacebookId(id);
            try
            {
                var lastSession = (await gameSessionsRepository.GetByUser(user)).Where(w => w.Score != 0).OrderBy(o => o.Date).FirstOrDefault();
                if (lastSession != null)
                    return Ok(lastSession.Year);
            }
            catch
            {
                return Ok(1);
            }

            return Ok(1);
        }
    }
}
