import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export * from './model/api-info';

export * from './greeting';

export * from './greeting/response';
