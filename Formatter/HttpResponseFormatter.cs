using System.Net;
using HotChocolate.AspNetCore.Serialization;
using HotChocolate.Execution;

namespace Backend.Formatter;

public class HttpResponseFormatter : DefaultHttpResponseFormatter {
    protected override HttpStatusCode OnDetermineStatusCode(IQueryResult result, FormatInfo format, HttpStatusCode? proposedStatusCode) {
        if (result.Errors is null || result.Errors.Count <= 0) return HttpStatusCode.OK;
        var errors = result.Errors;
        if (errors.Any(e => e.Code == ErrorCodes.UnauthorizedCode))
            return HttpStatusCode.Unauthorized;

        if (errors.Any(e => e.Code == ErrorCodes.WrongCredentials || e.Code == ErrorCodes.EmailNotVerified))
            return HttpStatusCode.Forbidden;

        return base.OnDetermineStatusCode(result, format, proposedStatusCode);
    }
}