export interface WcAdminShippingZone {
  id: number;
  name: string;
  order: number;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    describedby: Array<{ href: string }>;
  };
}

export interface WcAdminShippingZoneRequest {
  name?: string;
  order?: number;
}

export interface WcAdminShippingZoneQueryParams {
  context?: 'view' | 'edit';
}

export interface WcAdminShippingZoneLocation {
  code: string;
  type: 'postcode' | 'state' | 'country' | 'continent';
  _links: {
    collection: Array<{ href: string }>;
    describes: Array<{ href: string }>;
  };
}

export interface WcAdminShippingZoneLocationRequest {
  code: string;
  type: 'postcode' | 'state' | 'country' | 'continent';
}

export interface WcAdminShippingZoneMethod {
  instance_id: number;
  title: string;
  order: number;
  enabled: boolean;
  method_id: string;
  method_title: string;
  method_description: string;
  settings: {
    [key: string]: {
      id: string;
      label: string;
      description: string;
      type: string;
      value: string;
      default: string;
      tip: string;
      placeholder: string;
    };
  };
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    describes: Array<{ href: string }>;
  };
}

export interface WcAdminShippingZoneMethodRequest {
  order?: number;
  enabled?: boolean;
  settings?: {
    [key: string]: string;
  };
}

export interface WcAdminShippingZoneMethodQueryParams {
  context?: 'view' | 'edit';
}
