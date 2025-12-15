import { z } from 'zod';

export const ImageResponseSchema = z.looseObject({
  id: z.number(),
  src: z.string(),
  thumbnail: z.string(),
  srcset: z.string(),
  sizes: z.string(),
  name: z.string(),
  alt: z.string(),
});

export type ImageResponse = z.infer<typeof ImageResponseSchema>;
