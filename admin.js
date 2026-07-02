const RSVP_BACKUP_KEY = 'kylie7-rsvp-backup';
const adminPanel = document.getElementById('adminPanel');
const adminTable = document.getElementById('adminTable');
const adminCount = document.getElementById('adminCount');
const clearAdminDataBtn = document.getElementById('clearAdminDataBtn');

function loadRsvpBackup(){
  try {
    return JSON.parse(localStorage.getItem(RSVP_BACKUP_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function renderAdminPanel(){
  if (!adminPanel || !adminTable || !adminCount) return;

  const items = loadRsvpBackup();
  const tbody = adminTable.querySelector('tbody');
  tbody.innerHTML = '';
  adminCount.textContent = items.length;

  if (!items.length) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="3">No saved RSVP entries yet.</td>';
    tbody.appendChild(row);
    return;
  }

  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${item.name}</td><td>${item.guests}</td><td>${item.time}</td>`;
    tbody.appendChild(row);
  });
}

function clearAdminData(){
  localStorage.removeItem(RSVP_BACKUP_KEY);
  renderAdminPanel();
}

if (clearAdminDataBtn) {
  clearAdminDataBtn.addEventListener('click', clearAdminData);
}

renderAdminPanel();
