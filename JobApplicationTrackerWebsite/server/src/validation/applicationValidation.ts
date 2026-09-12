//status values accepted by the backend
//keeping this list centralized prevents arbitrary status strings from being stored
const VALID_STATUSES = [
    "Interested",
    "Applied",
    "Evaluation",
    "Interview",
    "Rejected",
    "No Response"
]

//validate incoming application data before its sent to Prisma
//returns an error message when validation fails, or null when data is valid
export function validateApplication(data: any): string | null {
    //company and position are required fields and cannot contain only whitespace
    if (typeof data.company !== "string" || data.company.trim() === ""){
        return "Company is required.";
    }

    if (typeof data.position !== "string" || data.position.trim() === ""){
        return "Position is required.";
    }

    //reject statuses that are not part of the defined workflow
    if (!VALID_STATUSES.includes(data.status)){
        return "Invalid Status.";
    }

    if (typeof data.location !== "string"){
        return "Location must be a string.";
    }

    if (typeof data.dateApplied !== "string"){
        return "Date applied must be a string.";
    }
    
    //all applications must contain either a date applied or an empty string if status is "Interested"
    if (data.status === "Interested" && data.dateApplied.trim() !== ""){
        return "Applications with Interested status cannot have a date applied"
    }
    if (data.status !== "Interested" && data.dateApplied.trim() === ""){
        return "Date applied is required for submitted applications.";
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

    //null indicates that all validation chekcs passed
    return null;
}