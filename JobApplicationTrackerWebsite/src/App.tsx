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

  async function deleteApplication(id: number) {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete application.");
      }

      setApplications((prevApplications) =>
        prevApplications.filter((application) => application.id !== id),
      );

      if (editingApplication?.id === id) {
        setEditingApplication(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function editApplication(updatedApplication: JobApplication) {
    try {
      const response = await fetch(
        `api/applications/${updatedApplication.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedApplication),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update application.");
      }

      const savedApplication: JobApplication = await response.json();

      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === savedApplication.id
            ? savedApplication
            : application,
        ),
      );

      setEditingApplication(null);
    } catch (error) {
      console.error(error);
    }
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
