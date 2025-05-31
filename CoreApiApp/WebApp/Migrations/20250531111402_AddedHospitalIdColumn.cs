using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreApiApp.Migrations
{
    /// <inheritdoc />
    public partial class AddedHospitalIdColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Designation",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Department",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Designation_HospitalId",
                table: "Designation",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_Department_HospitalId",
                table: "Department",
                column: "HospitalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Department_Hospital_HospitalId",
                table: "Department",
                column: "HospitalId",
                principalTable: "Hospital",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Designation_Hospital_HospitalId",
                table: "Designation",
                column: "HospitalId",
                principalTable: "Hospital",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Department_Hospital_HospitalId",
                table: "Department");

            migrationBuilder.DropForeignKey(
                name: "FK_Designation_Hospital_HospitalId",
                table: "Designation");

            migrationBuilder.DropIndex(
                name: "IX_Designation_HospitalId",
                table: "Designation");

            migrationBuilder.DropIndex(
                name: "IX_Department_HospitalId",
                table: "Department");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Designation");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Department");
        }
    }
}
