using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace dotnet_angular;

public class Weather
{
    public int Id { get; set; }
    public int Temperature { get; set; }
    public int Rain { get; set; }
    public int Wind { get; set; }
    public DateOnly Date { get; set; } = new DateOnly();
    public int LocationId { get; set; }
    [ForeignKey("LocationId")]
    public Location Location { get; set; } = new Location();
}

public class WeatherContext : DbContext
{
    public WeatherContext(DbContextOptions<WeatherContext> options) : base(options) { }

    public DbSet<Weather> Weathers => Set<Weather>();
    public DbSet<Location> Locations => Set<Location>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();
    }
}
