export interface WcAdminShippingMethod {
  id: string;
  title: string;
  description: string;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface WcAdminShippingMethodQueryParams {
  context?: 'view';
}
