using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class AddS3Key : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_performances_songs_song_temp_id",
                table: "performances");

            migrationBuilder.AddColumn<string>(
                name: "s3key",
                table: "songs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "fk_performances_songs_song_file_name",
                table: "performances",
                column: "song_file_name",
                principalTable: "songs",
                principalColumn: "file_name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_performances_songs_song_file_name",
                table: "performances");

            migrationBuilder.DropColumn(
                name: "s3key",
                table: "songs");

            migrationBuilder.AddForeignKey(
                name: "fk_performances_songs_song_temp_id",
                table: "performances",
                column: "song_file_name",
                principalTable: "songs",
                principalColumn: "file_name");
        }
    }
}
