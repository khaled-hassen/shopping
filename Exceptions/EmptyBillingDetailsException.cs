namespace Backend.Exceptions;

public class EmptyBillingDetailsException : Exception {
    public EmptyBillingDetailsException() : base("Fill out yout billing details before checking out") { }
}