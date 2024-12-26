using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KaraokeParty.Migrations {
	/// <inheritdoc />
	public partial class ChangePrimaryKey : Migration {
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropForeignKey(
				name: "fk_performances_songs_song_file_name",
				table: "performances");

			migrationBuilder.DropPrimaryKey(
				name: "pk_songs",
				table: "songs");

			migrationBuilder.RenameColumn(
				name: "song_file_name",
				table: "performances",
				newName: "song_video_id");

			migrationBuilder.Sql(@$"
				WITH vwTemp AS (
					SELECT file_name, video_id
					FROM songs
				)
                UPDATE performances
				SET song_video_id = vwTemp.video_id
				from vwTemp
				WHERE song_video_id = vwTemp.file_name
            ");

			migrationBuilder.RenameIndex(
				name: "ix_performances_song_file_name",
				table: "performances",
				newName: "ix_performances_song_video_id");

			migrationBuilder.AddPrimaryKey(
				name: "pk_songs",
				table: "songs",
				column: "video_id");

			migrationBuilder.AddForeignKey(
				name: "fk_performances_songs_song_video_id",
				table: "performances",
				column: "song_video_id",
				principalTable: "songs",
				principalColumn: "video_id");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropForeignKey(
				name: "fk_performances_songs_song_video_id",
				table: "performances");

			migrationBuilder.DropPrimaryKey(
				name: "pk_songs",
				table: "songs");

			migrationBuilder.RenameColumn(
				name: "song_video_id",
				table: "performances",
				newName: "song_file_name");

			migrationBuilder.Sql(@$"
                WITH vwTemp AS (
					SELECT file_name, video_id
					FROM songs
				)
                UPDATE performances
				SET song_video_id = vwTemp.file_name
				from vwTemp
				WHERE song_video_id = vwTemp.video_id
            ");

			migrationBuilder.RenameIndex(
				name: "ix_performances_song_video_id",
				table: "performances",
				newName: "ix_performances_song_file_name");

			migrationBuilder.AddPrimaryKey(
				name: "pk_songs",
				table: "songs",
				column: "file_name");

			migrationBuilder.AddForeignKey(
				name: "fk_performances_songs_song_file_name",
				table: "performances",
				column: "song_file_name",
				principalTable: "songs",
				principalColumn: "file_name");
		}
	}
}
