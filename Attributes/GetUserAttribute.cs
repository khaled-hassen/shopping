using Backend.Middleware;

namespace Backend.Attributes;

public class GetUserAttribute : GlobalStateAttribute {
    public GetUserAttribute() : base(UserMiddleware.UserContextDataKey) { }
}