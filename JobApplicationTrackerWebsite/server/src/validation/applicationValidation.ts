const VALID_STATUSES = [
    "Interested",
    "Applied",
    "Evaluation",
    "Interview",
    "Rejected",
    "No Response"
]

export function validateApplication(data: any): string | null {
    if (typeof data.company !== "string" || data.company.trim() === ""){
        return "Company is required.";
    }

    if (typeof data.position !== "string" || data.position.trim() === ""){
        return "Position is required.";
    }

    if (!VALID_STATUSES.includes(data.status)){
        return "Invalid Status.";
    }

    if (typeof data.location !== "string"){
        return "Location must be a string.";
    }

    if (typeof data.dateApplied !== "string"){
        return "Date applied must be a string.";
    }

    if (typeof data.jobUrl !== "string"){
        return "Job URL must be a string.";
    }

    if (typeof data.salary !== "string"){
        return "Salary must be a string.";
    }

    if (typeof data.notes !== "string"){
        return "Notes must be a string.";
    }

    return null;
}