using Microsoft.AspNetCore.Mvc;

namespace dotnet_angular.Controllers;

[Route("[controller]")]
public class LocationController : ControllerBase
{
    private readonly WeatherContext context;

    public LocationController(WeatherContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public List<Location> Get()
    {
        var locations = this.context.Locations.ToList();
        return locations;
    }
}

