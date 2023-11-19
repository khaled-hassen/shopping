namespace Backend.Interfaces;

public interface IFileUploadService {
    public Task<string> UploadFileAsync(IFile file, string folder, string filename);

    public string CreateStorageSavePath(string folder, string filename);

    public string GetPublicPath(string folder, string filename);

    public void DeleteDirectory(string folder);

    public void DeleteFile(string absolutePath);
}