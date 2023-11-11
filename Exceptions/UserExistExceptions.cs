namespace Backend.Exceptions;

public class UserExistException : Exception {
    public UserExistException() : base("A user with this email address already exists") { }
}