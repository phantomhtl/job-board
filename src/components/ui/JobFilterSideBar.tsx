import React from "react";
import { Label } from "./label";
import { Input } from "./input";
import Select from "./select";
import prisma from "@/lib/prisma";
import { jobTypes } from "@/lib/job-types";
import { Button } from "./button";
import { JobFilterSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import { JobFilterValues } from "@/lib/validation";
import FormSubmitButton from "../FormSubmitButton";
export async function filterJobs(formData: FormData) {
  "use server";
  const values = Object.fromEntries(formData.entries());
  const { q, type, location, remote } = JobFilterSchema.parse(values);
  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });
  redirect(`/?${searchParams.toString()}`);
}

interface JobFilterSideBarProps{
  defaultValues: JobFilterValues;

}

export default async function JobFilterSideBar({defaultValues}:JobFilterSideBarProps) {
  const distinctLocations = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations: { location: any; }[]) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <aside className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input name="q" id="q" placeholder="Job title, Company, etc." defaultValue={defaultValues.q}/>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Job Type</Label>
            <Select id="type" name="type" defaultValue={defaultValues.type || ""}>
              <option value="">All types</option>
              {jobTypes.map((jobtype) => (
                <option value={jobtype} key={jobtype}>
                  {jobtype}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select id="location" name="location" defaultValue={defaultValues.location || ""}>
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option value={location} key={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remote"
              name="remote"
              className="scale-125 accent-black"
              defaultChecked={defaultValues.remote}
            />
            <Label htmlFor="remote">Remote Jobs</Label>
          </div>
          <FormSubmitButton className="w-full">
            Filter Jobs
          </FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
