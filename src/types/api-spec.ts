export interface ApiSpec {
  method: string;
  path: string;
  description?: string;
  requestBody?: unknown;
  responseBody?: unknown;
}
