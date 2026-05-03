import type { Request } from 'express';
import type { ZodTypeAny } from 'zod';
import { ZodError as ZodNativeError } from 'zod';
import { ZodValidationError } from '@global/helpers/error-handler';

type IZodDecorator = (
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;

export function zodValidation(schema: ZodTypeAny, asyncValidation = false): IZodDecorator {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];

      try {
        let parsedData;

        if (asyncValidation) {
          parsedData = await schema.parseAsync(req.body ?? {});
        } else {
          const result = schema.safeParse(req.body ?? {});

          if (!result.success) {
            throw new ZodValidationError(result.error);
          }

          parsedData = result.data;
        }

        req.body = parsedData;

        return originalMethod.apply(this, args);
      } catch (err: any) {
        if (err instanceof ZodNativeError) {
          throw new ZodValidationError(err);
        }

        throw err;
      }
    };

    return descriptor;
  };
}
