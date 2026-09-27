import { z } from 'zod';

export interface GreetingResponse {
  message: string;
}

export const greetingResponseSchema: z.ZodType<GreetingResponse> = z.object({
  message: z.string(),
}).openapi('GreetingResponsePayload');
