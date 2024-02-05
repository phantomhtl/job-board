"use server";

import { toSlug } from "@/lib/utils";
import { CreateJobSchema } from "@/lib/validation";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import path from "path";
export async function CreateJobPosting(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const {
    title,
    type,
    companyName,
    companyLogo,
    locationType,
    location,
    applicationEmail,
    applicationUrl,
    description,
    salary,
  } = CreateJobSchema.parse(values);
  const slug = `${toSlug(title)}-${nanoid(10)}`;
  
  let companyLogoUrl: string | undefined = undefined;
  if (companyLogo) {
    const blob = await put(
      `company_logos/${slug}${path.extname(companyLogo.name)}`,
      companyLogo,
      {
        access: "public",
        addRandomSuffix: false,
      },
    );
    companyLogoUrl = blob.url;
  }
  await prisma.job.create({
    data: {
      slug,
      title: title.trim(),
      type,
      companyName: companyName.trim(),
      companyLogoUrl,
      locationType,
      location,
      applicationEmail: applicationEmail?.trim(),
      applicationUrl: applicationUrl?.trim(),
      description: description?.trim(),
      salary: parseInt(salary),
    },
  });
  redirect("/job-submitted");
}
