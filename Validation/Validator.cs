using Backend.Exceptions;
using FluentValidation;

namespace Backend.Validation;

/// <summary>
///     Static class with validation logic
/// </summary>
/// <typeparam name="V">The validation class to be used</typeparam>
/// <typeparam name="T">The type of the object to be validated</typeparam>
public static class Validator<V, T> where V : AbstractValidator<T> {
    public static void ValidateAndThrow(T obj, string? errorMessage = null) {
        var validator = Activator.CreateInstance<V>();
        var result = validator.Validate(obj);
        if (!result.IsValid) {
            var errors = new List<InvalidInputExceptions>();
            result.Errors.ForEach(e => errors.Add(new InvalidInputExceptions(errorMessage ?? e.ErrorMessage)));
            throw new AggregateException(errors);
        }
    }
}