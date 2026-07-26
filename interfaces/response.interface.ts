export interface IGenericResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}
