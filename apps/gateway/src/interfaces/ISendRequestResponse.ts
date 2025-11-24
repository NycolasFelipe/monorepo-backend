export interface ISendRequestResponse {
  headers?: Record<string, string>;
  contentType?: string;
  status: number;
  data: any;
}