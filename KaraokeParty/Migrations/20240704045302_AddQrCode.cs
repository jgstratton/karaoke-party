using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class AddQrCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "qr_code_enabled",
                table: "parties",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "qr_code_size",
                table: "parties",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "qr_code_enabled",
                table: "parties");

            migrationBuilder.DropColumn(
                name: "qr_code_size",
                table: "parties");
        }
    }
}
