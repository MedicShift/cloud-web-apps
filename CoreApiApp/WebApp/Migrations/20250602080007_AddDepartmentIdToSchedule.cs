using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreApiApp.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentIdToSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "Schedule",
                type: "int",
                nullable: false,
                defaultValue: 0);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_Department_DepartmentId",
                table: "Schedule");

            migrationBuilder.DropIndex(
                name: "IX_Schedule_DepartmentId",
                table: "Schedule");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Schedule");
        }
    }
}
