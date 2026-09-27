import { z } from 'zod';

import { defineApiInfo, HttpMethodEnum } from '../model/apiInfo';
import { greetingResponseSchema, type GreetingResponse } from './response';

export const greetingRequestSchema = z.object({
  name: z.string().trim().min(1),
  mood: z.enum(['friendly', 'formal']).openapi('GreetingMood').optional(),
}).openapi('GreetingRequest');

type GreetingRequest = z.infer<typeof greetingRequestSchema>;

export const createGreetingApi = defineApiInfo({
  method: HttpMethodEnum.POST,
  path: '/greetings',
  summary: 'Create a greeting',
  tags: ['Greetings'],
  body: greetingRequestSchema,
  response: greetingResponseSchema,
  responseStatus: 200,
});

export const handleGreeting = (request: GreetingRequest): GreetingResponse => ({
  message: request.mood === 'formal' ? `Good day, ${request.name}.` : `Hello, ${request.name}!`,
});
