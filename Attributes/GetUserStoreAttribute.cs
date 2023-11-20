using Backend.Middleware;

namespace Backend.Attributes;

public class GetUserStoreAttribute : GlobalStateAttribute {
    public GetUserStoreAttribute() : base(UserMiddleware.UserStoreContextDataKey) { }
}