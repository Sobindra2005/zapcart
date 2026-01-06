export type DimensionUnit = 'cm' | 'inch';

export interface IDimensions {
  length: number;
  width: number;
  height: number;
  unit: DimensionUnit;
}


export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
  ancestors?: string[];
  level?: number;
  image?: string;
  icon?: string;
  color?: string;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  isActive: boolean;
  displayOrder?: number;
  productCount?: number;

  createdAt: string;
  updatedAt: string;

  __v: number;

  /** Virtuals */
  isRoot?: boolean;
  id: string;
}


export interface IProductVariant {
  sku: string;
  size?: string;
  color?: string;
  material?: string;

  price: number;
  compareAtPrice?: number;

  stock: number;
  images?: string[];

  weight?: number;
  dimensions?: IDimensions;
}

export interface Product {
  _id: string;
  id: string;

  name: string;
  slug: string;
  description: string;
  shortDescription?: string;

  /* Pricing */
  basePrice: number;
  compareAtPrice?: number;
  costPrice?: number;

  /* Categorization */
  category: ICategory;
  subcategories?: ICategory[] | string[];
  brand?: string;
  tags: string[];

  /* Variants */
  hasVariants: boolean;
  variants: IProductVariant[];

  /* Inventory */
  totalStock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;

  /* Media */
  images: string[];
  thumbnail?: string;
  videoUrl?: string;

  /* SEO */
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  /* Product Details */
  specifications?: Record<string, string>;
  features?: string[];
  weight?: number;
  dimensions?: IDimensions;

  /* Status */
  status: 'draft' | 'active' | 'archived';
  visibility: 'public' | 'hidden' | 'featured';
  publishedAt?: string;

  /* Analytics */
  viewCount: number;
  salesCount: number;
  averageRating: number;
  reviewCount: number;

  /* Virtuals */
  inStock: boolean;
  isLowStock: boolean;
  discountPercentage: number;

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
}

