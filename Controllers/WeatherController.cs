using Microsoft.AspNetCore.Mvc;

namespace dotnet_angular.Controllers;

[Route("[controller]")]
public class WeatherController : ControllerBase
{
    private readonly WeatherContext context;

    public WeatherController(WeatherContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public List<Weather> Get()
    {
        var forecasts = this.context.Weathers.ToList();
        return forecasts;
    }

    [HttpPost]
    public StatusCodeResult Post([FromBody] Weather weather)
    {
        this.context.Weathers.Add(weather);
        this.context.SaveChanges();
        return Ok();
    }
}
