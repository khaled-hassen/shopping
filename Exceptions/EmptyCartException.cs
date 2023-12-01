namespace Backend.Exceptions;

public class EmptyCartException : Exception {
    public EmptyCartException() : base("You cannot checkout with an empty cart") { }
}