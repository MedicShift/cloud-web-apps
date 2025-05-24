using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreApiApp.Migrations
{
    /// <inheritdoc />
    public partial class AddHospitalPlanSetupFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAdmin",
                table: "Staff");

            migrationBuilder.RenameColumn(
                name: "RoleId",
                table: "Staff",
                newName: "Role");

            migrationBuilder.AddColumn<DateTime>(
                name: "PlanExpiresOn",
                table: "Hospital",
                type: "datetime",
                nullable: false,
                defaultValueSql: "DATEADD(day, 30, GETDATE())");

            migrationBuilder.AddColumn<byte>(
                name: "PlanStatus",
                table: "Hospital",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<byte>(
                name: "SetupStatus",
                table: "Hospital",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlanExpiresOn",
                table: "Hospital");

            migrationBuilder.DropColumn(
                name: "PlanStatus",
                table: "Hospital");

            migrationBuilder.DropColumn(
                name: "SetupStatus",
                table: "Hospital");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Staff",
                newName: "RoleId");

            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                table: "Staff",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
