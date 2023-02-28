using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_angular.Migrations
{
    /// <inheritdoc />
    public partial class UseForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Weathers_LocationId",
                table: "Weathers",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Weathers_Locations_LocationId",
                table: "Weathers",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Weathers_Locations_LocationId",
                table: "Weathers");

            migrationBuilder.DropIndex(
                name: "IX_Weathers_LocationId",
                table: "Weathers");
        }
    }
}
