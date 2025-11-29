export { default as Product, IProduct, IProductVariant } from './Product';
export { default as Category, ICategory } from './Category';
export { default as ProductReview, IProductReview } from './ProductReview';
export { default as SearchIndex, ISearchIndex } from './SearchIndex';

export const models = {
  Product: () => require('./Product').default,
  Category: () => require('./Category').default,
  ProductReview: () => require('./ProductReview').default,
  SearchIndex: () => require('./SearchIndex').default,
};
