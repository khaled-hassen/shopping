using Backend.Interfaces;
using Path = System.IO.Path;

namespace Backend.Services;

public class FileUploadService : IFileUploadService {
    public async Task<string> UploadFile(IFile file, string folder, string filename) {
        List<string> allowedFileTypes = new() { "image/jpeg", "image/png" };

        if (!allowedFileTypes.Contains(file.ContentType ?? "")) throw new Exception("File type not allowed");

        var extension = Path.GetExtension(file.Name);
        var path = CreateStorageSavePath(folder, filename + extension);
        await using Stream stream = File.Create(path);
        await file.CopyToAsync(stream);
        return GetPublicPath(folder, filename + extension);
    }

    public string CreateStorageSavePath(string folder, string filename) {
        var storage = Path.Combine("wwwroot", "Storage");
        if (!Directory.Exists(storage)) Directory.CreateDirectory(storage);

        var folderPath = Path.Combine(storage, folder);
        if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

        return Path.Combine(folderPath, filename);
    }

    public string GetPublicPath(string folder, string filename) {
        return Path.Combine("Storage", folder, filename);
    }

    public void DeleteDirectory(string folder) {
        var folderPath = Path.Combine("wwwroot", "Storage", folder);
        if (Directory.Exists(folderPath)) Directory.Delete(folderPath, true);
    }

    public void DeleteFile(string absolutePath) {
        var filePath = Path.Combine("wwwroot", absolutePath);
        if (File.Exists(filePath)) File.Delete(filePath);
    }
}