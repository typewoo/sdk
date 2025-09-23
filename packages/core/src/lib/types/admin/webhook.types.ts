export interface WcAdminWebhook {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'disabled';
  topic: string;
  resource: string;
  event: string;
  hooks: string[];
  delivery_url: string;
  secret: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface WcAdminWebhookRequest {
  name?: string;
  status?: 'active' | 'paused' | 'disabled';
  topic?: string;
  secret?: string;
  delivery_url?: string;
}

export interface WcAdminWebhookQueryParams {
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
  orderby?: 'date' | 'id' | 'title';
  status?: 'all' | 'active' | 'paused' | 'disabled';
}
