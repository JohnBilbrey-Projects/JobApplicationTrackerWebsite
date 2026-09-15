import type { JobApplication } from "../types";

//Data and action handlers supplied by the parent App component
type ApplicationTableProps = {
  applications: JobApplication[];
  onDelete: (id: number) => void;
  onEdit: (application: JobApplication) => void;
};

function ApplicationTable({
  applications,
  onDelete,
  onEdit,
}: ApplicationTableProps) {
  return (
    <table className="application-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Position</th>
          <th>Status</th>
          <th>Job URL</th>
          <th>Location</th>
          <th>Date Applied</th>
          <th>Salary</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {/*Render one table row for each application supplied by App.tsx */}
        {applications.map((application) => (
          <tr key={application.id}>
            <td>{application.company}</td>
            <td>{application.position}</td>
            <td>
              {/*Convert statuses into CSS firendly class names*/}
              <span
                className={`status-badge status-${application.status.toLowerCase().replaceAll(" ", "-")}`}
              >
                {application.status}
              </span>
            </td>
            <td>
              {application.jobUrl ? (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="job-link"
                >
                  View Job
                </a>
              ) : (
                "N/A"
              )}
            </td>
            <td>{application.location}</td>
            {/*show "N/A" for applications w no date applied */}
            <td>{application.dateApplied || "N/A"}</td>
            <td>{application.salary}</td>
            {/*styling truncates long notes so they dont expand the table too much */}
            <td className="notes-cell">{application.notes}</td>
            <td>
              {/*pass selected entry back to App.tsx so it can open it edit mode */}
              <button onClick={() => onEdit(application)}>Edit</button>
              {/*Only ID is needed to identify record to delete */}
              <button onClick={() => onDelete(application.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ApplicationTable;
