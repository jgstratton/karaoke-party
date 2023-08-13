using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class AddLogChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ip",
                table: "connection_log",
                newName: "device_id");

            migrationBuilder.AddColumn<string>(
                name: "browser_details",
                table: "connection_log",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "browser_details",
                table: "connection_log");

            migrationBuilder.RenameColumn(
                name: "device_id",
                table: "connection_log",
                newName: "ip");
        }
    }
}
