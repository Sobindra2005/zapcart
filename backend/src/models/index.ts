import Product, { IProduct, IProductVariant } from './Product';
import Category, { ICategory } from './Category';
import ProductReview, { IProductReview } from './ProductReview';
import SearchIndex, { ISearchIndex } from './SearchIndex';

export { Product, IProduct, IProductVariant };
export { Category, ICategory };
export { ProductReview, IProductReview };
export { SearchIndex, ISearchIndex };

export const models = {
  Product: () => Product,
  Category: () => Category,
  ProductReview: () => ProductReview,
  SearchIndex: () => SearchIndex,
};