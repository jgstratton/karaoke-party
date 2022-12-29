using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class AddSongs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Songs",
                columns: table => new
                {
                    FileName = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Songs", x => x.FileName);
                });

            migrationBuilder.CreateTable(
                name: "Queue",
                columns: table => new
                {
                    QueueId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PartyId = table.Column<int>(type: "integer", nullable: true),
                    SingerId = table.Column<int>(type: "integer", nullable: true),
                    SongFileName = table.Column<string>(type: "text", nullable: true),
                    SongCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Queue", x => x.QueueId);
                    table.ForeignKey(
                        name: "FK_Queue_Parties_PartyId",
                        column: x => x.PartyId,
                        principalTable: "Parties",
                        principalColumn: "PartyId");
                    table.ForeignKey(
                        name: "FK_Queue_Singers_SingerId",
                        column: x => x.SingerId,
                        principalTable: "Singers",
                        principalColumn: "SingerId");
                    table.ForeignKey(
                        name: "FK_Queue_Songs_SongFileName",
                        column: x => x.SongFileName,
                        principalTable: "Songs",
                        principalColumn: "FileName");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Queue_PartyId",
                table: "Queue",
                column: "PartyId");

            migrationBuilder.CreateIndex(
                name: "IX_Queue_SingerId",
                table: "Queue",
                column: "SingerId");

            migrationBuilder.CreateIndex(
                name: "IX_Queue_SongFileName",
                table: "Queue",
                column: "SongFileName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Queue");

            migrationBuilder.DropTable(
                name: "Songs");
        }
    }
}
