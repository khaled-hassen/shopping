namespace Backend.Exceptions;

public class InvalidInputExceptions : Exception {
    public InvalidInputExceptions(string? message) : base(message) { }
}