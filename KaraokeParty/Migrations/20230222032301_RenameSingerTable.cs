using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KaraokeParty.Migrations {
	/// <inheritdoc />
	public partial class RenameSingerTable : Migration {
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropForeignKey(
				name: "fk_performances_singers_singer_id",
				table: "performances");

			migrationBuilder.DropTable(
				name: "singers");

			migrationBuilder.Operations.Add(new SqlOperation {
				Sql = "delete from performances"
			});
			migrationBuilder.RenameColumn(
				name: "singer_id",
				table: "performances",
				newName: "user_id");

			migrationBuilder.RenameIndex(
				name: "ix_performances_singer_id",
				table: "performances",
				newName: "ix_performances_user_id");

			migrationBuilder.AddColumn<string>(
				name: "singer_name",
				table: "performances",
				type: "text",
				nullable: false,
				defaultValue: "");

			migrationBuilder.CreateTable(
				name: "users",
				columns: table => new {
					userid = table.Column<int>(name: "user_id", type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
					isdj = table.Column<bool>(name: "is_dj", type: "boolean", nullable: false),
					partyid = table.Column<int>(name: "party_id", type: "integer", nullable: true)
				},
				constraints: table => {
					table.PrimaryKey("pk_users", x => x.userid);
					table.ForeignKey(
						name: "fk_users_parties_party_id",
						column: x => x.partyid,
						principalTable: "parties",
						principalColumn: "party_id");
				});

			migrationBuilder.CreateIndex(
				name: "ix_users_party_id",
				table: "users",
				column: "party_id");

			migrationBuilder.AddForeignKey(
				name: "fk_performances_users_user_id",
				table: "performances",
				column: "user_id",
				principalTable: "users",
				principalColumn: "user_id");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropForeignKey(
				name: "fk_performances_users_user_id",
				table: "performances");

			migrationBuilder.DropTable(
				name: "users");

			migrationBuilder.DropColumn(
				name: "singer_name",
				table: "performances");

			migrationBuilder.RenameColumn(
				name: "user_id",
				table: "performances",
				newName: "singer_id");

			migrationBuilder.RenameIndex(
				name: "ix_performances_user_id",
				table: "performances",
				newName: "ix_performances_singer_id");

			migrationBuilder.CreateTable(
				name: "singers",
				columns: table => new {
					singerid = table.Column<int>(name: "singer_id", type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					isdj = table.Column<bool>(name: "is_dj", type: "boolean", nullable: false),
					name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
					partyid = table.Column<int>(name: "party_id", type: "integer", nullable: true)
				},
				constraints: table => {
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

			migrationBuilder.AddForeignKey(
				name: "fk_performances_singers_singer_id",
				table: "performances",
				column: "singer_id",
				principalTable: "singers",
				principalColumn: "singer_id");
		}
	}
}
