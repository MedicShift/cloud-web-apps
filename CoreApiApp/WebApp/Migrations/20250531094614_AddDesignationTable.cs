using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreApiApp.Migrations
{
    /// <inheritdoc />
    public partial class AddDesignationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Staff");

            migrationBuilder.AddColumn<int>(
                name: "DesignationId",
                table: "Staff",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                table: "Staff",
                type: "BIT",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Designation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Title = table.Column<string>(type: "NVARCHAR(256)", nullable: false),
                    CreatedAt = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Designation", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Staff_DesignationId",
                table: "Staff",
                column: "DesignationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_Designation_DesignationId",
                table: "Staff",
                column: "DesignationId",
                principalTable: "Designation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Designation_DesignationId",
                table: "Staff");

            migrationBuilder.DropTable(
                name: "Designation");

            migrationBuilder.DropIndex(
                name: "IX_Staff_DesignationId",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "DesignationId",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "IsAdmin",
                table: "Staff");

            migrationBuilder.AddColumn<byte>(
                name: "Role",
                table: "Staff",
                type: "TINYINT",
                nullable: false,
                defaultValue: (byte)0);
        }
    }
}
