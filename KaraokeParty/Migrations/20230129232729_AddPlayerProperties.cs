using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class AddPlayerProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "video_length",
                table: "parties",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "video_position",
                table: "parties",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "video_length",
                table: "parties");

            migrationBuilder.DropColumn(
                name: "video_position",
                table: "parties");
        }
    }
}
