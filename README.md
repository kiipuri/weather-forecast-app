# weather-forecast-app
App to add, modify and visualize weather forecast data, built with ASP.NET and Angular

## Dependencies

- PostgreSQL
- .NET 7.0 SDK
- .NET 7.0 Runtime
- ASP.NET Core 7.0


## Setup

1. Setup PostgreSQL
2. Update database connection string in appsettings.json
3. Install npm packages
```bash
cd ClientApp
npm install
```
4. Install Entity Framework Tools
```bash
dotnet tool install --global dotnet-ef
```
5. Update database
```bash
dotnet ef database update
```

## Running
Run the app with `dotnet run`
