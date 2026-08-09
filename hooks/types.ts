
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

export interface statsProps {
    ballots: number;
    candidates: number;
    parties: number;
    positions: number;
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

export interface Position {
  id: string;
  title: string;
  maxVotes: number;
  order: number;
  hasCandidates: boolean;
}