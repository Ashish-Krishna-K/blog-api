// Format date to a human readable format
const getDateFormatted = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
  }).format(new Date(date));
};

// Unescape escaped text elements so it can be 
// rendered as HTML
const getUnescapedHtml = (text: string) => {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x2F;/g, '/');
};

export { getDateFormatted, getUnescapedHtml };
