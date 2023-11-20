using Backend.Exceptions;
using FluentValidation;
using FluentValidation.Results;

namespace Backend.Validation;

/// <summary>
///     Static class with validation logic
/// </summary>
/// <typeparam name="V">The validation class to be used</typeparam>
/// <typeparam name="T">The type of the object to be validated</typeparam>
public static class Validator<V, T> where V : AbstractValidator<T> {
    public static void ValidateAndThrow(T obj, string? errorMessage = null) {
        var validator = Activator.CreateInstance<V>();
        ValidationResult? result = validator.Validate(obj);
        if (!result.IsValid) {
            var errors = new List<InvalidInputException>();
            result.Errors.ForEach(e => errors.Add(new InvalidInputException(errorMessage ?? e.ErrorMessage)));
            throw new AggregateException(errors);
        }
    }
}