export function wasItemEdited(updatedAt?: string | Date | null, createdAt?: string | Date | null): boolean {
  if (!updatedAt || !createdAt) return false;
  
  const updated = typeof updatedAt === 'string' ? updatedAt : updatedAt.toISOString();
  const created = typeof createdAt === 'string' ? createdAt : createdAt.toISOString();
  
  return updated > created;
}

export function getDateMetadata(updatedAt?: string | Date | null, createdAt?: string | Date | null): {
  wasEdited: boolean;
  dateToShow: string | Date | null | undefined;
  dateLabel: 'updated' | 'created';
} {
  const wasEdited = wasItemEdited(updatedAt, createdAt);
  const dateToShow = wasEdited ? updatedAt : createdAt;
  const dateLabel = wasEdited ? 'updated' : 'created';
  
  return { wasEdited, dateToShow, dateLabel };
}