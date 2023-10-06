namespace Backend.GraphQL;

public class Mutation {
    [UseMutationConvention]
    public string SetTest(string test) {
        return test;
    }
}