const envelopeScreen = document.getElementById('envelopeScreen');
const invitationContent = document.getElementById('invitationContent');
const envelopeBtn = document.getElementById('envelopeBtn');
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const shareBtn = document.getElementById('shareBtn');
const success = document.getElementById('success');
const person = document.getElementById('person');
const seats = document.getElementById('seats');
const guestName = document.getElementById('guestName');
const guestCount = document.getElementById('guestCount');
const qrImage = document.getElementById('qrImage');
const shareUrl = document.getElementById('shareUrl');
const rsvpForm = document.getElementById('rsvpForm');
const downloadRsvpBtn = document.getElementById('downloadRsvpBtn');
const buttonArea = document.querySelector('.button-area');
console.log('script.js loaded');

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiEY3fn-Ab_ndv4UPRwE6iYQbeOJlr-cejiLjoyXxiNq8W5w40q1MzZTTM5bzJ90YJ/exec';
const RSVP_BACKUP_KEY = 'kylie7-rsvp-backup';

const noMessages = [
  'NO 😅',
  'Are you sure? 🤔',
  'Really? 🥺',
  'Think again 😭',
  'But there will be cake 🍰',
  'Kylie is waiting ❤️',
  'Please come 🥹',
  'Last chance 😭'
];
let noCount = 0;
const isLocalFile = window.location.protocol === 'file:';
const invitationUrl = isLocalFile ? 'https://invitation.page' : (window.location.origin + window.location.pathname).replace(/#.*$/, '').replace(/\?.*$/, '');

function openInvitation(){

  document.querySelector('.flap').style.transform = 'rotateX(180deg)';
  document.querySelector('.letter').style.transform = 'translateY(-190px)';
  setTimeout(()=>{
    envelopeScreen.style.display = 'none';
    invitationContent.style.display = 'block';
    updateQrImage();
    updateYesButtonState();
  }, 1000);
}

window.openInvitation = openInvitation;

function moveButton(){
  const maxX = Math.max(0, buttonArea.clientWidth - noBtn.offsetWidth);
  const maxY = Math.max(0, buttonArea.clientHeight - noBtn.offsetHeight);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
  noBtn.textContent = noMessages[noCount % noMessages.length];
  noCount += 1;
  if (navigator.vibrate) {
    navigator.vibrate(40);
  }
}

function updateYesButtonState(){
  yesBtn.disabled = !guestName.value.trim();
}

function loadRsvpBackup(){
  try {
    return JSON.parse(localStorage.getItem(RSVP_BACKUP_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function saveRsvpBackup(entry){
  const items = loadRsvpBackup();
  items.push(entry);
  localStorage.setItem(RSVP_BACKUP_KEY, JSON.stringify(items));
}

function downloadRsvpBackup(auto = false){
  const items = loadRsvpBackup();
  if (!items.length) {
    if (!auto) {
      alert('No RSVP backup has been saved in this browser yet.');
    }
    return;
  }

  const csvRows = ['Name,Guests,Response,Time'];
  items.forEach(item => {
    const safeName = String(item.name || '').replace(/"/g, '""');
    const safeGuests = String(item.guests || '').replace(/"/g, '""');
    const safeResponse = String(item.response || '').replace(/"/g, '""');
    const safeTime = String(item.time || '').replace(/"/g, '""');
    csvRows.push(`"${safeName}","${safeGuests}","${safeResponse}","${safeTime}"`);
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kylie-rsvp-backup.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function confirmYes(event){
  if (event) {
    event.preventDefault();
  }

  const name = guestName.value.trim();
  if (!name) {
    guestName.focus();
    alert('Please enter your name before confirming your RSVP.');
    return;
  }

  const guestText = guestCount.value || '1 Guest';
  person.textContent = name;
  seats.textContent = guestText;
  success.style.display = 'block';
  yesBtn.textContent = 'THANK YOU ❤️';
  yesBtn.disabled = true;
  launchConfetti();

  saveRsvpBackup({
    name,
    guests: guestText,
    response: 'YES',
    time: new Date().toLocaleString()
  });

  downloadRsvpBackup(true);

  const payload = new URLSearchParams();
  payload.append('name', name);
  payload.append('guests', guestText);
  payload.append('response', 'YES');

  console.log('RSVP sending', { name, guestText, url: GOOGLE_SCRIPT_URL });

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: payload.toString()
  })
  .then(() => console.log('RSVP sent to Apps Script via POST'))
  .catch(err => console.warn('RSVP send failed', err));
}

function shareInvitation(){
  const shareText = "You're invited to Kylie's 7th Birthday Celebration! 💖";
  if (navigator.share){
    navigator.share({
      title:"You're invited to Kylie's 7th Birthday Celebration!",
      text: shareText,
      url: invitationUrl,
    }).catch(()=>{});
  } else {
    const shareLink = 'https://www.facebook.com/dialog/send?link=' + encodeURIComponent(invitationUrl);
    window.open(shareLink, '_blank');
  }
}

function updateQrImage(){
  if (isLocalFile) {
    const message = encodeURIComponent('Publish this invitation online first to generate a working QR code.');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${message}&t=${Date.now()}`;
    shareUrl.textContent = "💌 You're Invited — Open the invitation to view details.";
    return;
  }

  const encoded = encodeURIComponent(invitationUrl);
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}&t=${Date.now()}`;
  shareUrl.innerHTML = `
  <a href="${invitationUrl}"
     target="_blank"
     rel="noopener noreferrer"
     style="
        text-decoration: none;
        color: #7b2cbf;
        font-weight: 600;
        font-size: 16px;
     ">
     💌 You're Invited — Click Here to Open the Invitation
  </a>
`;
}

function launchConfetti(){
  const confettiContainer = document.getElementById('confettiLayer');
  const colors = ['#f28b82','#fbbc04','#34a853','#4285f4','#9c27b0'];
  for (let i = 0; i < 40; i++){
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    const size = Math.floor(Math.random() * 10) + 8;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size * 0.4 + 6}px`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `-20px`;
    confetti.style.opacity = '1';
    const duration = 1800 + Math.random() * 900;
    confetti.style.animation = `fall ${duration}ms ease-out forwards`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(confetti);
    setTimeout(() => confetti.remove(), duration + 200);
  }
}

noBtn.addEventListener('mouseenter', moveButton);
noBtn.addEventListener('click', moveButton);
noBtn.addEventListener('touchstart', moveButton);
yesBtn.addEventListener('click', confirmYes);
if (rsvpForm) {
  rsvpForm.addEventListener('submit', confirmYes);
}
/* shareBtn.addEventListener('click', shareInvitation); */
guestName.addEventListener('input', updateYesButtonState);
guestName.addEventListener('keydown', updateYesButtonState);

guestName.addEventListener('change', updateYesButtonState);
if (envelopeBtn) {
  envelopeBtn.addEventListener('click', openInvitation);
}

if (downloadRsvpBtn) {
  downloadRsvpBtn.addEventListener('click', () => downloadRsvpBackup(false));
}

updateYesButtonState();
if (isLocalFile) {
  const message = encodeURIComponent('Publish this invitation online first to generate a working QR code.');
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${message}&t=${Date.now()}`;
  shareUrl.textContent = "💌 You're Invited — Open the invitation to view details.";
  return;
}
