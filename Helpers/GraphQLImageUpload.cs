using Path = System.IO.Path;

namespace Backend.Helpers;

public static class GraphQLImageUpload {
    public static async Task<string> UploadImage(IFile image, string folder, string filename) {
        List<string> allowedFileTypes = new() { "image/jpeg", "image/png" };

        if (!allowedFileTypes.Contains(image.ContentType ?? "")) {
            throw new Exception("File type not allowed");
        }

        var extension = Path.GetExtension(image.Name);
        string path = CreateStorageSavePath(folder, filename + extension);
        await using Stream stream = File.Create(path);
        await image.CopyToAsync(stream);
        return GetPublicPath(folder, filename + extension);
    }

    public static string CreateStorageSavePath(string folder, string filename) {
        var storage = Path.Combine("wwwroot", "Storage");
        if (!Directory.Exists(storage)) {
            Directory.CreateDirectory(storage);
        }

        var folderPath = Path.Combine(storage, folder);
        if (!Directory.Exists(folderPath)) {
            Directory.CreateDirectory(folderPath);
        }

        return Path.Combine(folderPath, filename);
    }

    public static string GetPublicPath(string folder, string filename) {
        return Path.Combine("Storage", folder, filename);
    }

    public static void DeleteImageDirectory(string folder) {
        var folderPath = Path.Combine("wwwroot", "Storage", folder);
        if (Directory.Exists(folderPath)) {
            Directory.Delete(folderPath, true);
        }
    }
}