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

    [Route("{searchTerm}")]
    [HttpGet]
    public List<Location> Get(string searchTerm)
    {
        var locations = this.context.Locations
            .Where(l => l.City
                    .ToLower()
                    .StartsWith(searchTerm.ToLower()))
            .ToList();
        return locations;
    }

    [Route("New")]
    [HttpPost]
    public IActionResult Post([FromBody] string name)
    {
        var existingLocation = this.context.Locations
            .Where(l => l.City == name)
            .FirstOrDefault();
        if (existingLocation != null)
        {
            return BadRequest();
        }

        var location = new Location();
        location.City = name;
        this.context.Locations.Add(location);
        this.context.SaveChanges();
        return Ok();
    }

    [Route("Delete/{id}")]
    [HttpDelete]
    public IActionResult Delete(int id)
    {
        var location = this.context.Locations.Find(id);
        if (location == null)
        {
            return NotFound();
        }

        var weatherWithLocation = this.context.Weathers
            .Where(w => w.LocationId == id)
            .FirstOrDefault();
        if (weatherWithLocation != null)
        {
            return BadRequest();
        }

        this.context.Locations.Remove(location);
        this.context.SaveChanges();
        return Ok();
    }
}
