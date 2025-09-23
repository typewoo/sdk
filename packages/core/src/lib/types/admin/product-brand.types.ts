import { WcAdminImage } from './common.types.js';

export interface WcAdminProductBrand {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: 'default' | 'products' | 'subcategories' | 'both';
  image: WcAdminImage | null;
  menu_order: number;
  count: number;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up?: Array<{ href: string }>;
  };
}

export interface WcAdminProductBrandRequest {
  name?: string;
  slug?: string;
  parent?: number;
  description?: string;
  display?: 'default' | 'products' | 'subcategories' | 'both';
  image?: WcAdminImage;
  menu_order?: number;
}

export interface WcAdminProductBrandQueryParams {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  order?: 'asc' | 'desc';
  orderby?:
    | 'id'
    | 'include'
    | 'name'
    | 'slug'
    | 'term_group'
    | 'description'
    | 'count';
  hide_empty?: boolean;
  parent?: number;
  product?: number;
  slug?: string;
}
