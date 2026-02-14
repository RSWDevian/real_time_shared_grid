export type CellOwner = {
    userId: string;
    email: string;
};

export type ActivityEvent = {
    id: string;
    action: "booked" | "sold";
    userEmail: string;
    blockId: string;
    timestamp: number;
}

export type CellState = CellOwner | null