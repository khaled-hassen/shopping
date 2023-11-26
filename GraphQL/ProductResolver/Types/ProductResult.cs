﻿using Backend.Models;

namespace Backend.GraphQL.ProductResolver.Types;

public class ProductResult : StoreProductResult {
    public PublicStore Store { get; set; } = null!;
    public Category? Category { get; set; }
    public Subcategory? Subcategory { get; set; }
}