using Backend.Models;

namespace Backend.Helpers;

public class SubcategoryHelper {
    public static void TransformFiltersAndTypes(Subcategory subcategory) {
        if (subcategory.ProductTypes is not null) {
            HashSet<string> lowercaseTypes = new();
            foreach (var type in subcategory.ProductTypes)
                lowercaseTypes.Add(type.ToLower());
            subcategory.ProductTypes = lowercaseTypes;
        }

        if (subcategory.Filters is not null) {
            Dictionary<string, HashSet<string>> lowercaseFilters = new();
            foreach (var filter in subcategory.Filters) {
                HashSet<string> lowercaseValues = new();
                foreach (var value in filter.Value)
                    lowercaseValues.Add(value.ToLower());
                lowercaseFilters.Add(filter.Key.ToLower(), lowercaseValues);
            }

            subcategory.Filters = lowercaseFilters;
        }
    }
}