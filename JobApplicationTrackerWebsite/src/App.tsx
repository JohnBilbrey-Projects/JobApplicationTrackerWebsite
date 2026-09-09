import { useEffect, useState } from "react";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationForm from "./components/ApplicationForm";
import type { JobApplication, NewJobApplication } from "./types";

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

  async function addApplication(application: NewJobApplication) {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
      });

      if (!response.ok) {
        throw new Error("Failed to add application");
      }

      const newApplication: JobApplication = await response.json();

      setApplications((prevApplications) => [
        newApplication,
        ...prevApplications,
      ]);
    } catch (error) {
      console.error(error);
    }
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
