using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Pamaf.Context;
using Pamaf.Entities;
using Pamaf.Repositories.Interfaces;

namespace Pamaf.Repositories.Implementations
{
    public class UsersRepository : IUsersRepository
    {
        private readonly AppDbContext appDbContext;
        public UsersRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public  async Task Create(User user)
        {
            await appDbContext.Set<User>().AddAsync(user);

            await appDbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return await appDbContext.Set<User>()
                                     .ToListAsync();
        }

        public async Task<User> GetByFacebookId(string facebookId)
        {
            return await appDbContext.Set<User>()
                                     .FirstOrDefaultAsync(f => f.FacebookId == facebookId);
        }

        public async Task<User> GetById(Guid id)
        {
            return await appDbContext.Set<User>()
                         .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task Update(User user)
        {
            var item = await GetById(user.Id);

            item.FacebookName = user.FacebookName;

            await appDbContext.SaveChangesAsync();
        }
    }
}
