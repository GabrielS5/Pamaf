using Pamaf.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pamaf.Repositories.Interfaces
{
    public interface IUsersRepository
    {
        Task<IEnumerable<User>> GetAll();

        Task<User> GetById(Guid id);

        Task<User> GetByFacebookId(string facebookId);

        Task Create(User user);

        Task Update(User user);
    }
}
