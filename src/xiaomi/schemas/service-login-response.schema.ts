import { z } from 'zod';

export const serviceLoginResponseSchema = z.object({
  callback: z.string(),
  location: z.string(),
  code: z.number(),
  description: z.string().optional(),
  _sign: z.string(),
  sid: z.string(),
  result: z.string(),
  captchaUrl: z.string().nullable(),
});

export type ServiceLoginResponse = z.infer<typeof serviceLoginResponseSchema>;
