import { z } from 'zod';

export const ImageResponseSchema = z.looseObject({
  id: z.number().optional().describe('Image ID.'),
  src: z.string().optional().describe('Full size image URL.'),
  thumbnail: z.string().optional().describe('Thumbnail URL.'),
  srcset: z
    .string()
    .optional()
    .describe('Full size image srcset for responsive images.'),
  sizes: z
    .string()
    .optional()
    .describe('Full size image sizes for responsive images.'),
  name: z.string().optional().describe('Image name.'),
  alt: z.string().optional().describe('Image alternative text.'),
  thumbnail_sizes: z
    .string()
    .optional()
    .describe('Thumbnail sizes for responsive images.'),
  thumbnail_srcset: z
    .string()
    .optional()
    .describe('Thumbnail srcset for responsive images.'),
});

export type ImageResponse = z.infer<typeof ImageResponseSchema>;
