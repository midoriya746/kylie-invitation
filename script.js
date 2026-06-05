const envelopeScreen = document.getElementById('envelopeScreen');
const invitationContent = document.getElementById('invitationContent');
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
const buttonArea = document.querySelector('.button-area');

const noMessages = [
  'NO 😅',
  'Are you sure? 🤔',
  'Really? 🥺',
  'Think again 😭',
  'But there will be cake 🍰',
  'Lola Tess is waiting ❤️',
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
  }, 1000);
}

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

function confirmYes(){
  const name = guestName.value.trim() || 'Guest';
  const guestText = guestCount.value || '1 Guest';
  person.textContent = name;
  seats.textContent = guestText;
  success.style.display = 'block';
  yesBtn.textContent = 'THANK YOU ❤️';
  launchConfetti();
}

function shareInvitation(){
  const shareText = "You're invited to Tess' 70th Birthday Celebration! ❤️";
  if (navigator.share){
    navigator.share({
      title:'Tess 70th Birthday Invitation',
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
    shareUrl.textContent = 'Publish online to generate a working QR link.';
    return;
  }

  const encoded = encodeURIComponent(invitationUrl);
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}&t=${Date.now()}`;
  shareUrl.textContent = invitationUrl;
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
shareBtn.addEventListener('click', shareInvitation);

updateQrImage();
