using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class AddPlayerSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "marquee_enabled",
                table: "parties",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "marquee_size",
                table: "parties",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "marquee_speed",
                table: "parties",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "marquee_text",
                table: "parties",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "marquee_enabled",
                table: "parties");

            migrationBuilder.DropColumn(
                name: "marquee_size",
                table: "parties");

            migrationBuilder.DropColumn(
                name: "marquee_speed",
                table: "parties");

            migrationBuilder.DropColumn(
                name: "marquee_text",
                table: "parties");
        }
    }
}
