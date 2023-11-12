using System.Reflection;
using System.Runtime.CompilerServices;
using Backend.Middleware;
using HotChocolate.Types.Descriptors;

namespace Backend.Attributes;

public class UseUserAttribute : ObjectFieldDescriptorAttribute {
    public UseUserAttribute([CallerLineNumber] int order = 0) {
        Order = order;
    }

    protected override void OnConfigure(IDescriptorContext context, IObjectFieldDescriptor descriptor, MemberInfo member) {
        descriptor.Use<UserMiddleware>();
    }
}