using Microsoft.EntityFrameworkCore;

namespace dotnet_angular;

public class Weather
{
    public int Id { get; set; }
    public int Temperature { get; set; }
    public int Rain { get; set; }
    public int Wind { get; set; }
    public string Date { get; set; } = String.Empty;
}

public class WeatherContext : DbContext
{
    public WeatherContext(DbContextOptions<WeatherContext> options) : base(options) { }

    public DbSet<Weather> Weathers => Set<Weather>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();
    }
}
