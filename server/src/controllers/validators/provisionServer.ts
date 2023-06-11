import { Request } from 'express';
import * as z from 'zod';

// Remember to catch and send errors at the end of the controller
// } catch (err) {
//   if (err instanceof z.ZodError) {
//     return res.status(StatusCodes.BAD_REQUEST).send(err.errors);
//   }
// }

export const create = (req: Request) => {
  const schema = z.object({
    params: z.object({
      wabaId: z.string(),
    }),
  });
  return schema.parse(req);
};
