import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ImageResponseSchema = z.object({
  id: z.number(),
  src: z.string(),
  thumbnail: z.string(),
  srcset: z.string(),
  sizes: z.string(),
  name: z.string(),
  alt: z.string(),
});

export type ImageResponse = z.infer<typeof ImageResponseSchema>;
export class ApiImageResponse extends createZodDto(ImageResponseSchema) {}
