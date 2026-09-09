import { useEffect, useState } from "react";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationForm from "./components/ApplicationForm";
import type { JobApplication, NewJobApplication } from "./types";

const initialApplications: JobApplication[] = [
  {
    id: 1,
    company: "Microsoft",
    position: "software engineer",
    status: "Rejected",
    location: "Remote",
    dateApplied: "2026-09-09",
    jobUrl: "https://microsoft.com",
    salary: "$70,000",
    notes: "none",
  },
  {
    id: 2,
    company: "Google",
    position: "software engineer",
    status: "Rejected",
    location: "remote",
    dateApplied: "2026-09-09",
    jobUrl: "https://google.com",
    salary: "$85,000",
    notes: "none",
  },
];

function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      const response = await fetch("/api/applications");
      const data: JobApplication[] = await response.json();

      setApplications(data);
    }

    fetchApplications();
  }, []);

  function addApplication(application: NewJobApplication) {
    const newApplication: JobApplication = {
      id: Date.now(),
      ...application,
    };

    setApplications((prevApplications) => [
      newApplication,
      ...prevApplications,
    ]);
  }

  function deleteApplication(id: number) {
    setApplications((prevApplications) =>
      prevApplications.filter((application) => application.id !== id),
    );

    if (editingApplication?.id === id) {
      setEditingApplication(null);
    }
  }

  function editApplication(updatedApplication: JobApplication) {
    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === updatedApplication.id
          ? updatedApplication
          : application,
      ),
    );

    setEditingApplication(null);
  }

  function cancelEdit() {
    setEditingApplication(null);
  }

  return (
    <>
      <h1>Job Application Tracker</h1>

      <ApplicationForm
        onAddApplication={addApplication}
        onEditApplication={editApplication}
        editingApplication={editingApplication}
        onCancelEdit={cancelEdit}
      />

      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onDelete={deleteApplication}
          onEdit={setEditingApplication}
        />
      ))}
    </>
  );
}

export default App;
