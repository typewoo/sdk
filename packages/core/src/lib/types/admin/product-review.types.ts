export interface WcAdminProductReview {
  id: number;
  date_created: string;
  date_created_gmt: string;
  product_id: number;
  product_name: string;
  product_permalink: string;
  status: 'approved' | 'hold' | 'spam' | 'unspam' | 'trash' | 'untrash';
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
  reviewer_avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up: Array<{ href: string }>;
  };
}

export interface WcAdminProductReviewRequest {
  product_id?: number;
  product_name?: string;
  status?: 'approved' | 'hold' | 'spam' | 'unspam' | 'trash' | 'untrash';
  reviewer?: string;
  reviewer_email?: string;
  review?: string;
  rating?: number;
}

export interface WcAdminProductReviewQueryParams {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'date_gmt' | 'id' | 'include' | 'product';
  reviewer?: string[];
  reviewer_exclude?: number[];
  reviewer_email?: string;
  product?: number[];
  status?: string;
}
