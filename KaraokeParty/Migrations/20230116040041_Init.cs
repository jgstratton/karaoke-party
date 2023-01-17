using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "parties",
                columns: table => new
                {
                    partyid = table.Column<int>(name: "party_id", type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    partykey = table.Column<string>(name: "party_key", type: "character varying(10)", maxLength: 10, nullable: false),
                    datetimecreated = table.Column<DateTime>(name: "date_time_created", type: "timestamp with time zone", nullable: false),
                    isexpired = table.Column<bool>(name: "is_expired", type: "boolean", nullable: false),
                    playerstate = table.Column<int>(name: "player_state", type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_parties", x => x.partyid);
                });

            migrationBuilder.CreateTable(
                name: "songs",
                columns: table => new
                {
                    filename = table.Column<string>(name: "file_name", type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    url = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_songs", x => x.filename);
                });

            migrationBuilder.CreateTable(
                name: "singers",
                columns: table => new
                {
                    singerid = table.Column<int>(name: "singer_id", type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    isdj = table.Column<bool>(name: "is_dj", type: "boolean", nullable: false),
                    partyid = table.Column<int>(name: "party_id", type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_singers", x => x.singerid);
                    table.ForeignKey(
                        name: "fk_singers_parties_party_id",
                        column: x => x.partyid,
                        principalTable: "parties",
                        principalColumn: "party_id");
                });

            migrationBuilder.CreateTable(
                name: "performances",
                columns: table => new
                {
                    performanceid = table.Column<int>(name: "performance_id", type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    partyid = table.Column<int>(name: "party_id", type: "integer", nullable: true),
                    singerid = table.Column<int>(name: "singer_id", type: "integer", nullable: true),
                    songfilename = table.Column<string>(name: "song_file_name", type: "text", nullable: true),
                    status = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_performances", x => x.performanceid);
                    table.ForeignKey(
                        name: "fk_performances_parties_party_id",
                        column: x => x.partyid,
                        principalTable: "parties",
                        principalColumn: "party_id");
                    table.ForeignKey(
                        name: "fk_performances_singers_singer_id",
                        column: x => x.singerid,
                        principalTable: "singers",
                        principalColumn: "singer_id");
                    table.ForeignKey(
                        name: "fk_performances_songs_song_temp_id",
                        column: x => x.songfilename,
                        principalTable: "songs",
                        principalColumn: "file_name");
                });

            migrationBuilder.CreateIndex(
                name: "ix_performances_party_id",
                table: "performances",
                column: "party_id");

            migrationBuilder.CreateIndex(
                name: "ix_performances_singer_id",
                table: "performances",
                column: "singer_id");

            migrationBuilder.CreateIndex(
                name: "ix_performances_song_file_name",
                table: "performances",
                column: "song_file_name");

            migrationBuilder.CreateIndex(
                name: "ix_singers_party_id",
                table: "singers",
                column: "party_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "performances");

            migrationBuilder.DropTable(
                name: "singers");

            migrationBuilder.DropTable(
                name: "songs");

            migrationBuilder.DropTable(
                name: "parties");
        }
    }
}
