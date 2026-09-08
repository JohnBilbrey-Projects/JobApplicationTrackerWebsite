export type ApplicationStatus =
  | "Interested"
  | "Applied"
  | "Interview"
  | "Rejected"
  | "Evaluation";

export type JobApplication = {
  id: number;
  company: string;
  position: string;
  status: ApplicationStatus;
  location: string,
  dateApplied: string,
  jobUrl: string,
  salary: string,
  notes: string
};

export type NewJobApplication = Omit<JobApplication, "id">;