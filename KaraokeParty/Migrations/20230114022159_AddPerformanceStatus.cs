using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SongCompleted",
                table: "Performances");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Performances",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Performances");

            migrationBuilder.AddColumn<bool>(
                name: "SongCompleted",
                table: "Performances",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
