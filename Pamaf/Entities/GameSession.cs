using System;
using System.Collections.Generic;

namespace Pamaf.Entities
{
    public class GameSession
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public List<GameLevel> Levels { get; set; }
        public int Hearts { get; set; }
        public int Score { get; set; }
        public DateTime Date { get; set; }
        public int Year { get; set; }
        public bool Finished { get; set; }
        public int Time { get; set; }
        public int BotsEaten { get; set; }
    }
}
