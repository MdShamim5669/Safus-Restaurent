import { z } from 'zod';
import { Role } from '../shared';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    photoUrl: z.string().url().optional(),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(Role, {
      errorMap: () => ({ message: 'Role must be ADMIN or CUSTOMER' }),
    }),
  }),
});

export const UserValidation = {
  updateProfileSchema,
  updateUserRoleSchema,
};
