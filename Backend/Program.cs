using Backend.GraphQL;
using Backend.Services;
using Backend.Settings;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// setup graphql
builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationConventions()
    .AddMutationType<Mutation>();

// setup mongodb
builder.Services.Configure<DataBaseSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<DatabaseService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapGraphQL();

app.Run();