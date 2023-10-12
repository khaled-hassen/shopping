using Backend.GraphQL;
using Backend.GraphQL.CategoryResolver;
using Backend.Interfaces;
using Backend.Services;
using Backend.Settings;
using MongoDB.Bson;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// setup mongodb
builder.Services.Configure<DataBaseSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ISubcategoryService, SubcategoryService>();

// setup graphql
builder.Services.AddGraphQLServer()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = builder.Environment.IsDevelopment())
    .AddQueryType<Query>()
    .BindRuntimeType<ObjectId, IdType>()
    .AddTypeConverter<ObjectId, string>(o => o.ToString())
    .AddTypeConverter<string, ObjectId>(o => ObjectId.Parse(o))
    .AddType<CategoryQuery>()
    .AddMutationConventions()
    .AddMutationType<Mutation>()
    .AddType<CategoryMutation>();

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