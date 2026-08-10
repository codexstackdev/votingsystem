
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
    createdBy?: string;
}

export interface Position {
  _id: string;
  title: string;
  maxVotes: number;
  order: number;
  hasCandidates: boolean;
}

export interface Party {
  _id: string;
  name: string;
  color: string;
  logoUrl?: string;
  hasCandidates: boolean;
}

export type CandidateStatus = "pending" | "approved" | "disqualified";

export interface Candidate {
  id: string;
  student: {
    name: string;
    lrn: string;
    avatarUrl?: string;
  };
  position: string;
  party: {
    name: string;
    color: string;
  };
  status: CandidateStatus;
  platform: string;
}