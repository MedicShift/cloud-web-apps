using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Environment.EnvironmentName = "Development";


// Add services to the container.
builder.Services.AddControllers(); // <-- just AddControllers(), no Views
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ClientOnboardingApp", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ClientOnboardingApp v1");
    });
}
else
{
    app.UseExceptionHandler("/error"); // You can create a simple error controller for API
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers(); // <-- MapControllers instead of MapControllerRoute

app.Run();