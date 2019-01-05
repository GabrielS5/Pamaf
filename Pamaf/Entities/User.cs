using System;

namespace Pamaf.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string FacebookId { get; set; }
        public string FacebookName { get; set; }
    }
}
