import type { Request, Response, NextFunction } from 'express';

type IAsyncDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function catchAsync(): IAsyncDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const req: Request = args[0];
      const res: Response = args[1];
      const next: NextFunction = args[2];

      Promise.resolve(originalMethod.apply(this, [req, res, next])).catch(next);
    };

    return descriptor;
  };
}
