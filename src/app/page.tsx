import JobFilterSideBar from "@/components/ui/JobFilterSideBar";
import H1 from "@/components/ui/h1";
import JobResults from "@/components/ui/JobResults";
import { JobFilterValues } from "@/lib/validation";
import { Metadata } from "next";

interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
    page?: string;
  };
}

function getTitle({ q, type, location, remote }: JobFilterValues) {
  const titlePrefix = q
    ? `${q} Jobs`
    : type
      ? `${type} developer jobs`
      : remote
        ? "Remote developer jobs"
        : "All developer jobs";
  const titleSuffix = location ? `in ${location}` : "";
  return `${titlePrefix}${titleSuffix}`;
}

export function generateMetadata({
  searchParams: { q, type, location, remote },
}: PageProps): Metadata {
  return {
    title: `${getTitle({
      q,
      type,
      location,
      remote: remote === "true",
    })} | HT Jobs`,
  };
}

export default async function Home({
  searchParams: { q, type, location, remote, page },
}: PageProps) {
  const filterValues: JobFilterValues = {
    q,
    type,
    location,
    remote: remote === "true",
  };
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-3 py-10">
      <div className="space-y-5 text-center ">
        <H1>{getTitle(filterValues)}</H1>
        <p className="text-muted-foreground">Start your dream career. Today.</p>
      </div>
      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSideBar defaultValues={filterValues} />
        <JobResults
          filterValues={filterValues}
          page={page ? parseInt(page) : undefined}
        />
      </section>
    </main>
  );
}
