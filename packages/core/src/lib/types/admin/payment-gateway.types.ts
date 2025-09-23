export interface WcAdminPaymentGateway {
  id: string;
  title: string;
  description: string;
  order: number;
  enabled: boolean;
  method_title: string;
  method_description: string;
  method_supports: string[];
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
  };
}

export interface WcAdminPaymentGatewayRequest {
  order?: number;
  enabled?: boolean;
  settings?: {
    [key: string]: string;
  };
}

export interface WcAdminPaymentGatewayQueryParams {
  context?: 'view' | 'edit';
}
