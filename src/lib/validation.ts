import { z } from "zod";
import { jobTypes, locationTypes } from "./job-types";

export const ApplicationSchema = z
  .object({
    applicationEmail: z.string().max(100).email().optional().or(z.literal("")),
    applicationUrl: z.string().max(100).url().optional().or(z.literal("")),
  })
  .refine((data) => data.applicationEmail || data.applicationUrl, {
    message: "Email or URL is required.",
    path: ["applicationEmail"],
  });
export const locationSchema = z
  .object({
    locationType: z
      .string()
      .min(1, "Required")
      .refine(
        (value) => locationTypes.includes(value),
        "Invalid location type",
      ),
    location: z.string().max(100).optional(),
  })
  .refine(
    (data) =>
      !data.locationType || data.locationType === "Remote" || data.location,
    { message: "Location is required for on-site jobs", path: ["location"] },
  );

export const companyLogoSchema = z
  .custom<File | undefined>()
  .refine(
    (file) => !file || (file instanceof File && file.type.startsWith("image/")),
    "Must upload an image file",
  )
  .refine((file) => {
    return !file || file.size < 1024 * 1024 * 2;
  }, "File must be less than 2MB");
export type CreateJobValues = z.infer<typeof CreateJobSchema>;
export const CreateJobSchema = z
  .object({
    title: z.string().min(1, "Required").max(100),
    type: z
      .string()
      .min(1, "Required")
      .refine((value) => jobTypes.includes(value), "Invalid Job Type"),
    companyName: z.string().min(1, "Required").max(100),
    companyLogo: companyLogoSchema,
    description: z.string().max(5000).optional(),
    salary: z
      .string()
      .min(1, "Required")
      .regex(/^\d+$/, "Salary must be a number")
      .max(9, "Salary out of bound"),
  })
  .and(ApplicationSchema)
  .and(locationSchema);

export const JobFilterSchema = z.object({
  q: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  remote: z.coerce.boolean().optional(),
});

export type JobFilterValues = z.infer<typeof JobFilterSchema>;
