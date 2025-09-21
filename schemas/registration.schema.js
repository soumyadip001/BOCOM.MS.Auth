import { z } from "zod";

export const startRegistrationSchema = z.object({
  email: z.email().optional().nullable(),
  phone: z.string().min(10).max(15),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  referralCode: z.string().optional().nullable(),
});

export const sendOtpSchema = z.object({
  userId: z.number().int().positive(),
  phone: z.string().regex(/^\d{10}$/),
});

export const verifyOtpSchema = z.object({
  userId: z.number().int().positive(),
  phone: z.string().regex(/^\d{10}$/),
  otp: z.string().length(6),
});

export const addressSchema = z.object({
  userId: z.number().int().positive(),
  addressLine1: z.string().max(150),
  addressLine2: z.string().max(150).optional().nullable(),
  city: z.string().max(50),
  state: z.string().max(50),
  postalCode: z.string().max(20).optional().nullable(),
  country: z.string().max(50).optional().nullable(),
});

export const finalizeSchema = z.object({
  userId: z.number().int().positive(),
  confirmation: z.boolean().default(false).optional(),
});
