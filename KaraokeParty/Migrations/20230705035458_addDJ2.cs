using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class addDJ2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_d_js",
                table: "d_js");

            migrationBuilder.RenameTable(
                name: "d_js",
                newName: "djs");

            migrationBuilder.RenameColumn(
                name: "d_jid",
                table: "djs",
                newName: "dj_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_djs",
                table: "djs",
                column: "dj_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_djs",
                table: "djs");

            migrationBuilder.RenameTable(
                name: "djs",
                newName: "d_js");

            migrationBuilder.RenameColumn(
                name: "dj_id",
                table: "d_js",
                newName: "d_jid");

            migrationBuilder.AddPrimaryKey(
                name: "pk_d_js",
                table: "d_js",
                column: "d_jid");
        }
    }
}
