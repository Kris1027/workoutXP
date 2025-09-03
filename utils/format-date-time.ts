export const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatDateTimeRelative = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Handle future dates
  if (diffMs < 0) {
    const futureDiffMs = Math.abs(diffMs);
    const futureDiffMins = Math.floor(futureDiffMs / (1000 * 60));
    const futureDiffHours = Math.floor(futureDiffMs / (1000 * 60 * 60));
    const futureDiffDays = Math.floor(futureDiffMs / (1000 * 60 * 60 * 24));

    if (futureDiffMins < 1) {
      return 'In a moment';
    }
    if (futureDiffMins < 60) {
      return `In ${futureDiffMins} minute${futureDiffMins === 1 ? '' : 's'}`;
    }
    if (futureDiffHours < 24) {
      return `In ${futureDiffHours} hour${futureDiffHours === 1 ? '' : 's'}`;
    }
    if (futureDiffDays < 7) {
      return `In ${futureDiffDays} day${futureDiffDays === 1 ? '' : 's'}`;
    }
    // For dates more than a week in the future, show the full date with time
    return formatDateTime(date);
  }
  
  // Handle past dates
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
  
  // For dates older than a week, show the full date with time
  return formatDateTime(date);
};

export const formatDateTimeSeparate = (date: Date) => {
  const dateStr = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  
  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
  
  return { date: dateStr, time: timeStr };
};