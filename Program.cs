using System.Text;
using Backend.Formatter;
using Backend.GraphQL;
using Backend.GraphQL.AdminResolver;
using Backend.GraphQL.CategoryResolver;
using Backend.GraphQL.ProductResolver;
using Backend.GraphQL.StoreResolver;
using Backend.GraphQL.SubcategoryResolver;
using Backend.GraphQL.UserResolver;
using Backend.Interfaces;
using Backend.Services;
using Backend.Settings;
using Fluid;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
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
            IConfigurationSection config = builder.Configuration.GetSection("Jwt");
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

// setup email template parser
builder.Services.AddSingleton<FluidParser>();

// setup mailing service
Configuration.Default.ApiKey.Add("api-key", builder.Configuration.GetSection("BrevoMailConfig:ApiKey").Value);
builder.Services.AddSingleton<TransactionalEmailsApi>();

// dependency injection
builder.Services.AddSingleton<IFileUploadService, FileUploadService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ISubcategoryService, SubcategoryService>();
builder.Services.AddScoped<IConfigService, ConfigService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddScoped<IStoreService, StoreService>();
builder.Services.AddScoped<IProductService, ProductService>();

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
    .AddType<AdminQuery>()
    .AddType<UserQuery>()
    .AddType<UserMutation>()
    .AddType<StoreQuery>()
    .AddType<StoreMutation>()
    .AddType<ProductQuery>()
    .AddType<ProductMutation>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(
    cors => {
        cors.AllowAnyHeader()
            .WithMethods("POST")
            .WithOrigins(
                app.Configuration.GetSection("Jwt:WebClient").Value ?? "",
                app.Configuration.GetSection("Jwt:AdminPanel").Value ?? ""
            )
            .AllowCredentials();
    }
);

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGraphQL();

app.Run();