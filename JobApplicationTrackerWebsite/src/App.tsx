import { useEffect, useState } from "react";
import ApplicationTable from "./components/ApplicationTable";
import ApplicationForm from "./components/ApplicationForm";
import type { JobApplication, NewJobApplication } from "./types";

function App() {
  //main application data loaded from + syncrhonized w backend API
  const [applications, setApplications] = useState<JobApplication[]>([]);

  //stores application that is currently being edited, if there is one
  //null value indicates that the form is being used to add a new application
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);

  //controls whether the add/edit modal is showing
  const [isFormOpen, setIsFormOpen] = useState(false);

  //table search, filtering, and sorting controls
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  //load all applications from backend when the component first mounts
  useEffect(() => {
    async function fetchApplications() {
      const response = await fetch("/api/applications");
      const data: JobApplication[] = await response.json();

      setApplications(data);
    }

    fetchApplications();
  }, []);

  //allow form modal to be closed using 'Escape' key
  //listener is only active while the modal is open
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

    //remove listener when modal closes or component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFormOpen]);

  //statistic dashboard values are deroved from current application data rather than
  //stored separately, which keeps them automatically synchronized
  const totalApplications = applications.length;

  //"Interested" means an application has not been submitted yet,
  //so every other status counts as a submitted application
  const submittedApplications = applications.filter(
    (application) => application.status !== "Interested",
  ).length;

  const interviewApplications = applications.filter(
    (application) => application.status === "Interview",
  ).length;

  const noResponseApplications = applications.filter(
    (application) => application.status === "No Response",
  ).length;

  //open form modal in add mode
  function openAddForm() {
    setEditingApplication(null);
    setIsFormOpen(true);
  }

  //open form modal in edit mode, using selected application's current data
  function openEditForm(application: JobApplication) {
    setEditingApplication(application);
    setIsFormOpen(true);
  }

  //reset edit state whenever the modal is closed
  function closeForm() {
    setEditingApplication(null);
    setIsFormOpen(false);
  }

  //persist a new application through the API, then add the returned database
  //record to local state so table updates immediately
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

  //Delete an application from database and remove it from local state, after backend confirms
  //deletion was successful
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

      //clear edit state if deleted application was being edited
      if (editingApplication?.id === id) {
        setEditingApplication(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  //save an edited application through the API and replace the matching item in
  //local state with the version returned by the backend
  async function editApplication(updatedApplication: JobApplication) {
    try {
      const response = await fetch(
        `/api/applications/${updatedApplication.id}`,
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

  //create table's displayed data from the full application list.
  //search and status filters are applied before sorting
  const displayedApplications = applications
    .filter((application) => {
      const matchesSearch =
        application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        //applications with status "Interested" don't have a date applied because the application
        //has not yet been submitted, so keep them above dated applications, as this likely means
        //it is a job posting i have recently discovered and haven't had the chance to apply yet
        if (a.status === "Interested" && b.status !== "Interested") {
          return -1;
        }
        if (a.status !== "Interested" && b.status === "Interested") {
          return 1;
        }

        return b.dateApplied.localeCompare(a.dateApplied);
      }

      if (sortOption === "oldest") {
        //for oldest-first sorting, undated entries (with status "Interested") are placed last
        if (a.status === "Interested" && b.status !== "Interested") {
          return 1;
        }
        if (a.status !== "Interested" && b.status === "Interested") {
          return -1;
        }

        return a.dateApplied.localeCompare(b.dateApplied);
      }

      if (sortOption === "company-az") {
        return a.company.localeCompare(b.company);
      }

      if (sortOption === "company-za") {
        return b.company.localeCompare(a.company);
      }

      return 0;
    });

  return (
    <div className="app">
      <div className="container">
        <header className="page-header">
          <h1>Job Application Tracker</h1>
        </header>

        {/*Dashboard statistical summary derived from current application data*/}
        <section className="dashboard">
          <div className="stat-card">
            <span className="stat-label">Total Applications</span>
            <span className="stat-value">{totalApplications}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Applied</span>
            <span className="stat-value">{submittedApplications}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Interviews</span>
            <span className="stat-value">{interviewApplications}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">No Response</span>
            <span className="stat-value">{noResponseApplications}</span>
          </div>
        </section>
        <section className="table-section">
          <div className="table-header">
            <h2>Applications</h2>
            <button className="add-button" onClick={openAddForm}>
              Add +
            </button>
          </div>

          {/*Controls used to search, sort, and filter */}
          <div className="table-toolbar">
            <input
              type="text"
              placeholder="Search company or position..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Interested">Interested</option>
              <option value="Applied">Applied</option>
              <option value="No Response">No Response</option>
              <option value="Interview">Interview</option>
              <option value="Evaluation">Evaluation</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company-az">Company A-Z</option>
              <option value="company-za">Company Z-A</option>
            </select>
          </div>

          <ApplicationTable
            applications={displayedApplications}
            onDelete={deleteApplication}
            onEdit={openEditForm}
          />
        </section>

        {/*Same form modal is used for both adding and editing applications */}
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
