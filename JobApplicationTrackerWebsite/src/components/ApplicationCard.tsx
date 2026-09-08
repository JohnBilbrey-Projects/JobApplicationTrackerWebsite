import type { JobApplication } from "../types";

type ApplicationCardProps = {
  application: JobApplication;
  onDelete: (id: number) => void;
  onEdit: (application: JobApplication) => void;
};

function ApplicationCard({
  application,
  onDelete,
  onEdit,
}: ApplicationCardProps) {
  return (
    <>
      <h2>{application.company}</h2>
      <p>Position: {application.position}</p>
      <p>Status: {application.status}</p>
      <p>Location: {application.location}</p>
      <p>Date Applied: {application.dateApplied}</p>
      <p>Salary: {application.salary}</p>
      <p>Notes: {application.notes}</p>
      <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
        {application.jobUrl}
      </a>
      <br />
      <button onClick={() => onDelete(application.id)}>Delete</button>
      <button onClick={() => onEdit(application)}>Edit</button>
    </>
  );
}

export default ApplicationCard;
