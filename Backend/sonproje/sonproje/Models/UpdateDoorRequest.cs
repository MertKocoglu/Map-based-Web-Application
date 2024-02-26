namespace sonproje.Models
{
    public class UpdateDoorRequest
    {
        public double NewX { get; set; }
        public double NewY { get; set; }
        public required string NewName { get; set; }
    }
}
