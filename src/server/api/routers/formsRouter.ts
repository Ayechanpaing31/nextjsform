import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "~/server/db";
const handleError = (error: Error, message: string) => {
  // Log the error for debugging
  console.error(error);

  // Here you can add more complex logic, like sending the error to an error-tracking service

  throw new Error(`${message}: ${error.message}`);
};

export const formRouter = createTRPCRouter({
  // formslist: publicProcedure.query(async () => {
  //   const forms = await db.forms.findMany();
  //   return forms;
  // }),
  formslist: protectedProcedure
    .query(async ({ ctx }) => {
        try {
            const forms = await db.forms.findMany({
              where: {
                createdById: ctx.session.user.id
              }
            });
            return forms;
        } catch (err) {
            handleError(err as Error, "Failed to find Form objects");
            throw err; // Rethrow the error after handling it
        }
    }),
    formSelectByID: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const form = await db.forms.findUniqueOrThrow({
          where: {
            id: input.id,
            createdById: ctx.session.user.id
          },
        });
        return form;
      } catch (err) {
        handleError(err as Error, "Failed to find Form object");
      }
    }),
  formsCreate: protectedProcedure
  .input(
    z.object({
      workout_title: z.string(),
      completion_date: z.date(), 
      workout_type: z.string(),
      checkboxes: z.array(z.string()), 
      updates: z.string(),
      difficulty_rating: z.number(), 
      ongoing: z.boolean(), 
      form_image: z.string(),
    }),
  )
    .mutation(async ({ ctx, input }) => {
      try {
        const newForm = await db.forms.create({
          data: {
            workout_title: input.workout_title,
            completion_date: input.completion_date,
            workout_type: input.workout_type,
            checkboxes: input.checkboxes,  // Corrected assignment
            updates: input.updates,
            difficulty_rating: input.difficulty_rating,
            ongoing: input.ongoing,
            form_image: input.form_image,
            createdById: ctx.session.user.id
          },
        });
        return newForm;
      } catch (err) {
        handleError(err as Error, "Failed to create form");
      }
    }),
  formsUpdate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        workout_title: z.string().optional(),
      completion_date: z.date().optional(), 
      workout_type: z.string().optional(),
      checkboxes: z.array(z.string()).optional(), 
      updates: z.string().optional(),
      difficulty_rating: z.number().optional(), 
      ongoing: z.boolean().optional(), 
      form_image: z.string().optional(),
      }),
    )
    .mutation(async ({input}) => {
      try {
        const updatedForm = await db.forms.update({
          where: { id: input.id },
          data: {
            workout_title: input.workout_title,
            completion_date: input.completion_date,
            workout_type: input.workout_type,
            checkboxes: input.checkboxes,  // Corrected assignment
            updates: input.updates,
            difficulty_rating: input.difficulty_rating,
            ongoing: input.ongoing,
            form_image: input.form_image,
  
          },
        });
        return updatedForm;
      } catch (err) {
        handleError(err as Error, "Failed to update form");
      }
    }),
  formsDelete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const deletedForm = await db.forms.delete({
          where: { id: input.id },
        });
        return deletedForm;
      } catch (err) {
        handleError(err as Error, "Failed to delete form");
      }
    }),
});
