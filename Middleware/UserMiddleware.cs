using System.Security.Claims;
using Backend.GraphQL.UserResolver.Types;
using Backend.Models;
using Backend.Services;
using HotChocolate.Resolvers;
using MongoDB.Driver;

namespace Backend.Middleware;

public class UserMiddleware {
    public const string UserContextDataKey = "User";
    private readonly FieldDelegate _next;
    private readonly IMongoCollection<User> _users;

    public UserMiddleware(FieldDelegate next, DatabaseService db) {
        _next = next;
        _users = db.GetUsersCollection();
    }

    public async Task Invoke(IMiddlewareContext context, DatabaseService db) {
        var claimsPrincipal = context.GetUser();
        if (claimsPrincipal is null) {
            await _next(context);
            return;
        }

        var claim = claimsPrincipal.FindFirst(ClaimTypes.Sid);
        if (claim is null) {
            await _next(context);
            return;
        }

        var id = claim.Value;
        var user = await _users.Find(c => c.Id.ToString() == id)
            .Project<UserResult>(
                Builders<User>.Projection
                    .Include(c => c.Id)
                    .Include(c => c.FirstName)
                    .Include(c => c.LastName)
                    .Include(c => c.Email)
                    .Include(c => c.PhoneNumber)
            )
            .FirstOrDefaultAsync();
        if (user is null) {
            await _next(context);
            return;
        }

        context.ContextData.Add(UserContextDataKey, user);
        await _next(context);
    }
}