
type ElectionStatus = "draft" | "upcoming" | "active" | "ended";
export interface userProps {
    accountStatus: string;
    course: string;
    email: string;
    gradeLevel: number;
    lrnNumber: string;
    name: string;
    role: string;
}

export interface electionProps {
    id: string;
    isActivated: boolean;
    status: ElectionStatus;
    title: string;
    description: string;
    startAt: string;
    endAt: string
}