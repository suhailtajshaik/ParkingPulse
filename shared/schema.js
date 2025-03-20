import { z } from 'zod';

// Define the schema for parking events
export const parkingEventSchema = z.object({
  gateId: z.enum(['level1-main', 'level1-back', 'level4-blue', 'level4-green']),
  direction: z.enum(['entry', 'exit']),
  timestamp: z.string().datetime(),
  metadata: z.object({
    boundingBox: z.array(z.number()).optional(),
    centroid: z.array(z.number()).optional()
  }).optional()
});

// Type for inserting events
export const insertEventSchema = parkingEventSchema;

// Schema for gate status
export const gateStatusSchema = z.object({
  gateId: z.enum(['level1-main', 'level1-back', 'level4-blue', 'level4-green']),
  occupancy: z.number(),
  lastEvent: parkingEventSchema.optional()
});

// Type for system status
export const systemStatusSchema = z.object({
  totalOccupancy: z.number(),
  gates: z.array(gateStatusSchema),
  lastUpdate: z.string().datetime()
});
