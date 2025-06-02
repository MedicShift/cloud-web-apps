using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreApiApp.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadeIssue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Shift",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ShiftType",
                table: "Shift",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "Schedule",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Shift_HospitalId",
                table: "Shift",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_DepartmentId",
                table: "Schedule",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Schedule_Department_DepartmentId",
                table: "Schedule",
                column: "DepartmentId",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shift_Hospital_HospitalId",
                table: "Shift",
                column: "HospitalId",
                principalTable: "Hospital",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_Department_DepartmentId",
                table: "Schedule");

            migrationBuilder.DropForeignKey(
                name: "FK_Shift_Hospital_HospitalId",
                table: "Shift");

            migrationBuilder.DropIndex(
                name: "IX_Shift_HospitalId",
                table: "Shift");

            migrationBuilder.DropIndex(
                name: "IX_Schedule_DepartmentId",
                table: "Schedule");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Shift");

            migrationBuilder.DropColumn(
                name: "ShiftType",
                table: "Shift");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Schedule");
        }
    }
}
