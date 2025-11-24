export interface IGatewayConstructor {
  SERVICE_NAME: string;
  PORT: string;
  REQUEST_AUTH_HEADER: string;
  REQUEST_URL: string;
  REQUEST_METHOD: string;
  REQUEST_BODY?: any;
  CUSTOM_HEADERS?: Record<string, string>;
}