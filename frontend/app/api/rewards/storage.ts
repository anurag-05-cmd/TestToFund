// Shared storage for claimed addresses
// In production, this should be replaced with a database
export const claimedAddresses = new Set<string>();

// Helper function to check if address has claimed
export function hasClaimedReward(address: string): boolean {
  return claimedAddresses.has(address.toLowerCase());
}

// Helper function to mark address as claimed
export function markAsClaimed(address: string): void {
  claimedAddresses.add(address.toLowerCase());
}

// Helper function to get all claimed addresses
export function getAllClaimedAddresses(): string[] {
  return Array.from(claimedAddresses);
}
