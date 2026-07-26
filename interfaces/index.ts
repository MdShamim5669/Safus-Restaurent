import { Router } from 'express';

export interface IModuleRoute {
  path: string;
  route: Router;
}

export interface IGenericResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}
