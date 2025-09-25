export interface WcAdminTax {
  id: number;
  country: string;
  state: string;
  postcode: string;
  city: string;
  postcodes: string[];
  cities: string[];
  rate: string;
  name: string;
  priority: number;
  compound: boolean;
  shipping: boolean;
  order: number;
  class: 'standard' | 'reduced-rate' | 'zero-rate';
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface WcAdminTaxRequest {
  country?: string;
  state?: string;
  postcode?: string;
  city?: string;
  postcodes?: string[];
  cities?: string[];
  rate?: string;
  name?: string;
  priority?: number;
  compound?: boolean;
  shipping?: boolean;
  order?: number;
  class?: 'standard' | 'reduced-rate' | 'zero-rate';
}

export interface WcAdminTaxQueryParams {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'id' | 'order' | 'priority';
  class?: 'standard' | 'reduced-rate' | 'zero-rate';
}

export interface WcAdminTaxClass {
  slug: string;
  name: string;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface WcAdminTaxClassRequest {
  name: string;
}

export interface WcAdminTaxClassQueryParams {
  context?: 'view' | 'edit';
}
