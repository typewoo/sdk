export interface WcAdminSetting {
  id: string;
  label: string;
  description: string;
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'color'
    | 'password'
    | 'textarea'
    | 'select'
    | 'multiselect'
    | 'radio'
    | 'image_width'
    | 'checkbox';
  default: string | number | boolean;
  tip: string;
  value: string | number | boolean;
  options?: { [key: string]: string };
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface WcAdminSettingRequest {
  value: string | number | boolean;
}

export interface WcAdminSettingGroup {
  id: string;
  label: string;
  description: string;
  parent_id: string;
  sub_groups: string[];
  _links: {
    options: Array<{ href: string }>;
  };
}
