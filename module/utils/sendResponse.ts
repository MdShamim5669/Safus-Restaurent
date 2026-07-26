import { Response } from 'express';
import { IGenericResponse } from '../../interfaces';

export const sendResponse = <T>(res: Response, data: IGenericResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || null,
    data: data.data || null,
  });
};
