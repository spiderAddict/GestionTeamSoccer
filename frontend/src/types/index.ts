export interface Player {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    additionalInfo?: string;
}

export interface Season {
    id: number;
    name: string;
    startDate: string; // ISO date string
}

export interface Match {
    id: number;
    date: string; // ISO date string
    seasonId: number;
    playerIds: number[]; // Array of player IDs present in the match
}

export interface Payment {
    id: number;
    payerId: number; // Player ID of the payer
    payeeId: number; // Player ID of the payee
    paymentDate: string; // ISO date string
    matchId: number; // Associated match ID
}