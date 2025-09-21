export interface user {
  id: string;
}

export interface response {
  status: number;
  data: any;
  error: any | null;
  message: string;
}

export interface request {
  endpoint: string;
  body: any;
  method: string;
  headers: any;
}
