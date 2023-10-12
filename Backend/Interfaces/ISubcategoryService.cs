using Backend.Models;

namespace Backend.Interfaces;

public interface ISubcategoryService {
    public Task<Subcategory> CreateCategoryAsync(Subcategory subcategory);
}