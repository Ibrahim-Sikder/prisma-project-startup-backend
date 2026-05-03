import type { Response } from 'express';

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: IPaginationMeta;
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    {
      message = 'Success',
      data,
      meta,
      statusCode = 200,
    }: {
      message?: string;
      data?: T;
      meta?: IPaginationMeta;
      statusCode?: number;
    },
  ) {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data,
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    { message = 'Resource created successfully', data }: { message?: string; data?: T },
  ) {
    return this.success(res, {
      message,
      data,
      statusCode: 201,
    });
  }

  static updated<T>(
    res: Response,
    { message = 'Resource updated successfully', data }: { message?: string; data?: T },
  ) {
    return this.success(res, { message, data });
  }

  static deleted(
    res: Response,
    { message = 'Resource deleted successfully' }: { message?: string },
  ) {
    return this.success(res, { message });
  }
}
