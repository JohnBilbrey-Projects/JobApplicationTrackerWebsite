import { useEffect, useState } from "react";
import { ApplicationStatus, JobApplication, NewJobApplication } from "../types";

type ApplicationFormProps = {
  onAddApplication: (application: NewJobApplication) => void;
  onEditApplication: (application: JobApplication) => void;
  editingApplication: JobApplication | null;
};

function ApplicationForm({
  onAddApplication,
  onEditApplication,
  editingApplication,
}: ApplicationFormProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("Rejected");
  const [location, setLocation] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (company.trim() === "" || position.trim() === "") {
      return;
    }

    if (editingApplication) {
      const updatedApplication: JobApplication = {
        id: editingApplication.id,
        company,
        position,
        status,
        location,
        dateApplied,
        jobUrl,
        salary,
        notes,
      };
      onEditApplication(updatedApplication);
    } else {
      const newApplication: NewJobApplication = {
        company,
        position,
        status,
        location,
        dateApplied,
        jobUrl,
        salary,
        notes,
      };

      onAddApplication(newApplication);
      setCompany("");
      setPosition("");
      setStatus("Rejected");
      setLocation("");
      setDateApplied("");
      setJobUrl("");
      setSalary("");
      setNotes("");
    }
  }
  useEffect(() => {
    if (editingApplication) {
      setCompany(editingApplication.company);
      setPosition(editingApplication.position);
      setStatus(editingApplication.status);
      setLocation(editingApplication.location);
      setDateApplied(editingApplication.dateApplied);
      setJobUrl(editingApplication.jobUrl);
      setSalary(editingApplication.salary);
      setNotes(editingApplication.notes);
    }
  }, [editingApplication]);
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Company: </label>
        <input
          type="text"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      <div>
        <label>Position: </label>
        <input
          type="text"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
        />
      </div>

      <div>
        <label>Status: </label>
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as ApplicationStatus)
          }
        >
          <option value="Interested">Interested</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Evaluation">Evaluation</option>
        </select>
      </div>

      <div>
        <label>Location: </label>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </div>

      <div>
        <label>Date Applied: </label>
        <input
          type="date"
          value={dateApplied}
          onChange={(event) => setDateApplied(event.target.value)}
        />
      </div>

      <div>
        <label>Job Posting URL: </label>
        <input
          type="url"
          value={jobUrl}
          onChange={(event) => setJobUrl(event.target.value)}
        />
      </div>

      <div>
        <label>Salary: </label>
        <input
          type="text"
          value={salary}
          onChange={(event) => setSalary(event.target.value)}
        />
      </div>

      <div>
        <label>Notes: </label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>

      <button type="submit">
        {editingApplication ? "Save Changes" : "Add Application"}
      </button>
    </form>
  );
}

export default ApplicationForm;
