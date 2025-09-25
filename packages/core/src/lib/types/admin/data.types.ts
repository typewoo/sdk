export interface WcAdminCountry {
  code: string;
  name: string;
  states: Array<{
    code: string;
    name: string;
  }>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface WcAdminCurrency {
  code: string;
  name: string;
  symbol: string;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface WcAdminContinent {
  code: string;
  name: string;
  countries: Array<{
    code: string;
    name: string;
    currency_code: string;
    currency_pos: string;
    decimal_sep: string;
    dimension_unit: string;
    num_decimals: number;
    thousand_sep: string;
    weight_unit: string;
    states: Array<{
      code: string;
      name: string;
    }>;
  }>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface WcAdminDataQueryParams {
  context?: 'view';
}
