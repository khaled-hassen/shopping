namespace Backend.Helpers;

public static class StringUtils {
    public static T ToLowerCase<T>(T collection) where T : ICollection<string>, new() {
        var result = new T();
        foreach (var item in collection) result.Add(item.ToLower());
        return result;
    }
}