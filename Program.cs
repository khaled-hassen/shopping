using System.Text;
using Backend.Formatter;
using Backend.GraphQL;
using Backend.GraphQL.AdminResolver;
using Backend.GraphQL.CategoryResolver;
using Backend.GraphQL.SubcategoryResolver;
using Backend.Interfaces;
using Backend.Services;
using Backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;

var builder = WebApplication.CreateBuilder(args);
AppConfig.Configure(builder.Configuration);

// Add services to the container.

// Auth setup
builder.Services
    .AddAuthentication(
        o => {
            o.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }
    )
    .AddJwtBearer(
        o => {
            var config = builder.Configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetSection("Key").Value ?? ""));

            o.TokenValidationParameters = new TokenValidationParameters {
                ValidIssuer = config.GetSection("Issuer").Value,
                ValidateIssuer = true,
                ValidAudiences = new List<string> {
                    config.GetSection("AdminPanel").Value ?? "",
                    config.GetSection("WebClient").Value ?? ""
                },
                ValidateAudience = true,
                IssuerSigningKey = key,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                RequireExpirationTime = true
            };
        }
    );

builder.Services.AddAuthorization();
builder.Services.AddHttpResponseFormatter<HttpResponseFormatter>();

// setup mongodb
builder.Services.Configure<DataBaseSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<DatabaseService>();

// dependency injection
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ISubcategoryService, SubcategoryService>();
builder.Services.AddScoped<IConfigService, ConfigService>();

// setup admin
builder.Services.AddHostedService<AdminHostedService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// setup graphql
builder.Services.AddHttpContextAccessor();
builder.Services.AddGraphQLServer()
    .AddAuthorization()
    .AllowIntrospection(builder.Environment.IsDevelopment())
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = builder.Environment.IsDevelopment())
    .AddQueryType<Query>()
    .BindRuntimeType<ObjectId, IdType>()
    .AddTypeConverter<ObjectId, string>(o => o.ToString())
    .AddTypeConverter<string, ObjectId>(o => ObjectId.Parse(o))
    .AddMutationConventions()
    .AddMutationType<Mutation>()
    .AddType<CategoryQuery>()
    .AddType<CategoryMutation>()
    .AddType<SubcategoryQuery>()
    .AddType<SubcategoryMutation>()
    .AddType<UploadType>()
    .AddType<AdminQuery>();

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

app.UseCors(
    cors => {
        cors.AllowAnyHeader();
        cors.AllowAnyMethod();
        cors.AllowAnyOrigin();
    }
);

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGraphQL();

app.Run();