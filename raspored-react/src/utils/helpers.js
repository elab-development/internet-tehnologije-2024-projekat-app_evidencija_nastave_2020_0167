export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('sr-RS');
};

export const formatTime = (time) => {
  return time.substring(0, 5); // "09:00:00" -> "09:00"
};