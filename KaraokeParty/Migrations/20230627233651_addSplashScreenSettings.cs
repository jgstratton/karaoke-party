using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class addSplashScreenSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "splash_screen_enabled",
                table: "parties",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "splash_screen_seconds",
                table: "parties",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "splash_screen_upcoming_count",
                table: "parties",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "splash_screen_enabled",
                table: "parties");

            migrationBuilder.DropColumn(
                name: "splash_screen_seconds",
                table: "parties");

            migrationBuilder.DropColumn(
                name: "splash_screen_upcoming_count",
                table: "parties");
        }
    }
}
