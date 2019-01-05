using Microsoft.AspNetCore.Mvc;
using Pamaf.Entities;
using Pamaf.Repositories.Interfaces;
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

        [HttpGet("{id}")]
        public async Task<IActionResult> Login(string id)
        {
            var user = await usersRepository.GetByFacebookId(id);
            if (user == null)
            {
                await usersRepository.Create(new User
                {
                    FacebookId = id
                });

                return Ok("Created");
            }
            return Ok("Logged In");
        }

        [HttpGet("{id}/year")]
        public async Task<IActionResult> GetYear(string id)
        {
            var user = await usersRepository.GetByFacebookId(id);
            var lastSession = (await gameSessionsRepository.GetByUser(user)).OrderBy(o => o.Date).FirstOrDefault();
            if (lastSession != null)
                return Ok(lastSession.Year);

            return Ok(1);
        }
    }
}
