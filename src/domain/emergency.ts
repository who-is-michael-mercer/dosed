import { z } from 'zod';

export const emergencyCallConfigSchema = z.strictObject({
  locale: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/),
  number: z.string().regex(/^\d{2,4}$/),
  dialerScheme: z.literal('tel'),
  fallbackLabel: z.string().min(1),
});
export type EmergencyCallConfig = z.infer<typeof emergencyCallConfigSchema>;
