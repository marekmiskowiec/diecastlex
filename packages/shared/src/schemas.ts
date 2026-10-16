import { z } from "zod";

export const conditionSchema = z.enum(["mint", "good", "fair", "poor"]);
export type Condition = z.infer<typeof conditionSchema>;

/** Wpis katalogowy: jeden model odlewu (wspólny dla wszystkich użytkowników). */
export const modelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  series: z.string().nullable(),
  year: z.number().int().nullable(),
  color: z.string().nullable(),
  toyNumber: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
});
export type Model = z.infer<typeof modelSchema>;

/** Egzemplarz w kolekcji użytkownika. */
export const collectionItemInputSchema = z.object({
  modelId: z.string().uuid(),
  condition: conditionSchema.default("mint"),
  quantity: z.number().int().min(1).default(1),
  pricePaid: z.number().nonnegative().nullable().default(null),
  notes: z.string().nullable().default(null),
});
export type CollectionItemInput = z.infer<typeof collectionItemInputSchema>;
