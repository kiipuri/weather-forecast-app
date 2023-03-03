using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        var forecasts = this.context.Weathers
            .Include(f => f.Location)
            .OrderBy(f => f.Date)
            .ToList();
        return forecasts;
    }

    public class DateQueryParams
    {
        public DateOnly? dateStart { get; set; }
        public DateOnly? dateEnd { get; set; }
    }

    [Route("Location")]
    [HttpGet]
    public List<Weather> Get([FromQuery] DateQueryParams queryParams)
    {
        var forecasts = this.context.Weathers
            .Include(f => f.Location)
            .Where(f => f.Date >= queryParams.dateStart)
            .Where(f => f.Date <= queryParams.dateEnd)
            .OrderBy(f => f.Date)
            .ToList();
        return forecasts;
    }

    [Route("Location/{location}")]
    [HttpGet]
    public List<Weather> Get(string location, [FromQuery] DateQueryParams queryParams)
    {
        if (queryParams.dateStart != null && queryParams.dateEnd != null)
        {
            var forecasts = this.context.Weathers
                .Include(f => f.Location)
                .Where(f => f.Location.City == location)
                .Where(f => f.Date >= queryParams.dateStart)
                .Where(f => f.Date <= queryParams.dateEnd)
                .OrderBy(f => f.Date)
                .ToList();
            return forecasts;
        }
        else
        {
            var forecasts = this.context.Weathers
                .Include(f => f.Location)
                .Where(f => f.Location.City == location)
                .OrderBy(f => f.Date)
                .ToList();
            return forecasts;
        }
    }

    [HttpPost]
    public IActionResult Post([FromBody] Weather weather)
    {
        var location = this.context.Locations.Find(weather.LocationId);
        if (location == null)
        {
            return NotFound();
        }

        weather.Location = location;
        this.context.Weathers.Add(weather);
        this.context.SaveChanges();
        return Ok();
    }

    [HttpPut]
    public IActionResult Put([FromBody] Weather weather)
    {
        this.context.Update(weather);
        this.context.SaveChanges();
        return Ok();
    }

    [Route("Delete/{id}")]
    [HttpDelete]
    public IActionResult Delete(int id)
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
