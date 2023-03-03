using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_angular.Migrations
{
    /// <inheritdoc />
    public partial class DateOnlyTypeForWeather : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE ""Weathers""
                    ALTER COLUMN ""Date"" DROP DEFAULT,
                    ALTER COLUMN ""Date"" TYPE Date USING ""Date""::date,
                    ALTER COLUMN ""Date"" SET DEFAULT Date('1970-01-01')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE ""Weathers""
                    ALTER COLUMN ""Date"" DROP DEFAULT,
                    ALTER COLUMN ""Date"" TYPE text USING ""Date""::date,
                    ALTER COLUMN ""Date"" SET DEFAULT ''::text");
        }
    }
}
