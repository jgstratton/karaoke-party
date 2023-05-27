using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KaraokeParty.Migrations
{
    /// <inheritdoc />
    public partial class AddSingers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_users_parties_party_id",
                table: "users");

            migrationBuilder.DropIndex(
                name: "ix_users_party_id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "party_id",
                table: "users");

            migrationBuilder.CreateTable(
                name: "singers",
                columns: table => new
                {
                    singerid = table.Column<int>(name: "singer_id", type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    partyid = table.Column<int>(name: "party_id", type: "integer", nullable: true),
                    rotationnumber = table.Column<int>(name: "rotation_number", type: "integer", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "ix_singers_party_id",
                table: "singers",
                column: "party_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "singers");

            migrationBuilder.AddColumn<int>(
                name: "party_id",
                table: "users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_party_id",
                table: "users",
                column: "party_id");

            migrationBuilder.AddForeignKey(
                name: "fk_users_parties_party_id",
                table: "users",
                column: "party_id",
                principalTable: "parties",
                principalColumn: "party_id");
        }
    }
}
