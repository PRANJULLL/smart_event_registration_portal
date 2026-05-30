/**
 * Convert registrations list to a clean CSV string
 * @param {Array} registrations Array of populated registration objects
 * @returns {string} CSV formatted string
 */
const convertToCSV = (registrations) => {
  const headers = ['Participant Name', 'Participant Email', 'Event Title', 'Registration Date', 'Attendance Status', 'Ticket ID'];
  
  const rows = registrations.map(reg => {
    const name = reg.userId ? reg.userId.name : 'N/A';
    const email = reg.userId ? reg.userId.email : 'N/A';
    const eventTitle = reg.eventId ? reg.eventId.title : 'N/A';
    const regDate = reg.registrationDate ? new Date(reg.registrationDate).toISOString() : 'N/A';
    const status = reg.attendanceStatus || 'Pending';
    const ticketId = reg.ticketId || 'N/A';
    
    return [name, email, eventTitle, regDate, status, ticketId];
  });

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const stringVal = String(val);
    const escaped = stringVal.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map(row => row.map(escapeCell).join(','))
  ].join('\r\n');

  return csvContent;
};

module.exports = { convertToCSV };
