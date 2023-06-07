using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class AddSingerPerformanceLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "singer_id",
                table: "performances",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_performances_singer_id",
                table: "performances",
                column: "singer_id");

            migrationBuilder.AddForeignKey(
                name: "fk_performances_singers_singer_id",
                table: "performances",
                column: "singer_id",
                principalTable: "singers",
                principalColumn: "singer_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_performances_singers_singer_id",
                table: "performances");

            migrationBuilder.DropIndex(
                name: "ix_performances_singer_id",
                table: "performances");

            migrationBuilder.DropColumn(
                name: "singer_id",
                table: "performances");
        }
    }
}
