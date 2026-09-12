import { useEffect, useState } from "react";
import { ApplicationStatus, JobApplication, NewJobApplication } from "../types";

//functions and data passed down from App.tsx
//same form is reused for both creating and editing applications
type ApplicationFormProps = {
  onAddApplication: (application: NewJobApplication) => void;
  onEditApplication: (application: JobApplication) => void;
  editingApplication: JobApplication | null;
  onCancelEdit: () => void;
};

function ApplicationForm({
  onAddApplication,
  onEditApplication,
  editingApplication,
  onCancelEdit,
}: ApplicationFormProps) {
  //each form field is controlled through local component state
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("No Response");
  const [location, setLocation] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");

  //reset all fields back to their defaults when starting a new application
  function clearForm() {
    setCompany("");
    setPosition("");
    setStatus("No Response");
    setLocation("");
    setDateApplied("");
    setJobUrl("");
    setSalary("");
    setNotes("");
  }

  //applications w status "Interested" have not been submitted, so
  //they should not have a submission date applied
  function handleStatusChange(newStatus: ApplicationStatus) {
    setStatus(newStatus);

    if (newStatus === "Interested") {
      setDateApplied("");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    //prevent the browser's default form submission and page refresh
    event.preventDefault();

    //company and position are required before an application can be submitted
    if (company.trim() === "" || position.trim() === "") {
      return;
    }

    if (editingApplication) {
      //preserve existing database ID when updating an application
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
      //new applications do not include an ID because the database creates it
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
      clearForm();
    }
  }

  //whenever the application being edited changes, populate the form with that
  //application's existing values. If no application is being edited, reset the
  //form for adding a new one
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
    } else {
      clearForm();
    }
  }, [editingApplication]);

  return (
    <form className="application-form" onSubmit={handleSubmit}>
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
            handleStatusChange(event.target.value as ApplicationStatus)
          }
        >
          <option value="Interested">Interested</option>
          <option value="Applied">Applied</option>
          <option value="Evaluation">Evaluation</option>
          <option value="Interview">Interview</option>
          <option value="No Response">No Response</option>
          <option value="Rejected">Rejected</option>
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
          disabled={status === "Interested"}
          required={status !== "Interested"}
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

      {/*Cancel is only needed while editing an existing application*/}
      {editingApplication && (
        <button type="button" onClick={onCancelEdit}>
          Cancel Edit
        </button>
      )}
    </form>
  );
}

export default ApplicationForm;
