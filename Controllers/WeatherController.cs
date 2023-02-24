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

    [HttpPut]
    public StatusCodeResult Put([FromBody] Weather weather)
    {
        this.context.Update(weather);
        this.context.SaveChanges();
        return Ok();
    }

    [Route("Delete/{id}")]
    [HttpDelete]
    public StatusCodeResult Delete(int id)
    {
        var weather = this.context.Weathers.Find(id);
        if (weather == null)
        {
            return NotFound();
        }
        this.context.Weathers.Remove(weather);
        this.context.SaveChanges();
        return Ok();
    }
}
