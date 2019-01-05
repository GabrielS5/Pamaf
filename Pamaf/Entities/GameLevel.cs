using System;

namespace Pamaf.Entities
{
    public class GameLevel
    {
        public Guid Id { get; set; }
        public GameSession GameSession { get; set; }
        public int LevelNumber { get; set; }
    }
}
