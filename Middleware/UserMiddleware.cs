using System.Security.Claims;
using Backend.GraphQL.UserResolver.Types;
using Backend.Models;
using Backend.Services;
using HotChocolate.Resolvers;
using MongoDB.Bson;
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
        ClaimsPrincipal? claimsPrincipal = context.GetUser();
        if (claimsPrincipal is null) {
            await _next(context);
            return;
        }

        Claim? claim = claimsPrincipal.FindFirst(ClaimTypes.Sid);
        if (claim is null) {
            await _next(context);
            return;
        }

        string id = claim.Value;
        User? user = await _users.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
        if (user is null) {
            await _next(context);
            return;
        }

        context.ContextData.Add(
            UserContextDataKey,
            new UserResult {
                Id = user.Id ?? ObjectId.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                EmailVerified = user.EmailVerifiedAt is not null,
                BillingDetails = user.BillingDetails
            }
        );
        await _next(context);
    }
}