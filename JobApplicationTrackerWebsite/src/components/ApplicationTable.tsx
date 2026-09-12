import type { JobApplication } from "../types";

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
        {applications.map((application) => (
          <tr key={application.id}>
            <td>{application.company}</td>
            <td>{application.position}</td>
            <td>
              <span
                className={`status-badge status-${application.status.toLowerCase().replaceAll(" ", "-")}`}
              >
                {application.status}
              </span>
            </td>
            <td>{application.jobUrl}</td>
            <td>{application.location}</td>
            <td>{application.dateApplied || "N/A"}</td>
            <td>{application.salary}</td>
            <td className="notes-cell">{application.notes}</td>
            <td>
              <button onClick={() => onEdit(application)}>Edit</button>

              <button onClick={() => onDelete(application.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ApplicationTable;
