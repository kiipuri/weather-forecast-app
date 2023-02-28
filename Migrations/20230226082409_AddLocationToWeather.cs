using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_angular.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationToWeather : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "Weathers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Weathers");
        }
    }
}
