import { useEffect, useState } from "react";
import ApplicationTable from "./components/ApplicationTable";
import ApplicationForm from "./components/ApplicationForm";
import type { JobApplication, NewJobApplication } from "./types";

function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    async function fetchApplications() {
      const response = await fetch("/api/applications");
      const data: JobApplication[] = await response.json();

      setApplications(data);
    }

    fetchApplications();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setEditingApplication(null);
        setIsFormOpen(false);
      }
    }

    if (isFormOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFormOpen]);

  function openAddForm() {
    setEditingApplication(null);
    setIsFormOpen(true);
  }

  function openEditForm(application: JobApplication) {
    setEditingApplication(application);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingApplication(null);
    setIsFormOpen(false);
  }

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
      setIsFormOpen(false);
      setEditingApplication(null);
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
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      <div className="container">
        <header className="page-header">
          <h1>Job Application Tracker</h1>
        </header>

        <section className="table-section">
          <div className="table-header">
            <h2>Applications</h2>
            <button className="add-button" onClick={openAddForm}>
              Add +
            </button>
          </div>
          <ApplicationTable
            applications={applications}
            onDelete={deleteApplication}
            onEdit={openEditForm}
          />
        </section>

        {isFormOpen && (
          <div className="modal-overlay" onClick={closeForm}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
              <button
                className="modal-close-button"
                onClick={closeForm}
                type="button"
              >
                x
              </button>
              <ApplicationForm
                onAddApplication={addApplication}
                onEditApplication={editApplication}
                editingApplication={editingApplication}
                onCancelEdit={closeForm}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
