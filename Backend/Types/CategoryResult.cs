﻿using Backend.Models;
using MongoDB.Bson;

namespace Backend.Types;

public class CategoryResult : Category {
    public HashSet<Subcategory> Subcategories { get; set; }

    [GraphQLIgnore]
    public HashSet<ObjectId> SubcategoriesIds { get; set; }
}