
fetch('https://mcapi.us/server/status?ip=alwination.id') 
  .then(response => response.json())
  .then(data => {
    if (data.online) {
      document.getElementById('player-count').textContent = `${data.players.now} players online`;  
      document.getElementById('player-count').textContent = 'Server Offline';  
    }
  })
  .catch(error => console.error('Error fetching Minecraft player count:', error));


fetch('https://discord.com/api/v9/guilds/your-guild-id/member-count', {
  method: 'GET',
  headers: {
    'Authorization': 'Bot YOUR_BOT_TOKEN'  
  }
})
  .then(response => response.json())
  .then(data => {
    document.getElementById('discord-count').textContent = `${data.member_count} members`;  
  })
  .catch(error => console.error('Error fetching Discord member count:', error));









// Load staff list dari backend
async function loadStaff() {
  const res = await fetch('/api/staff');
  const staff = await res.json();

  const container = document.querySelector('.staff-box');
  container.innerHTML = ''; // Clear sebelumnya

  staff.forEach(member => {
    const div = document.createElement('div');
    div.className = 'staff-member';
    div.innerHTML = `
      <img src="https://mc-heads.net/avatar/${member.username}" alt="${member.username}">
      <div class="role">${member.role}</div>
      <h2>${member.username}</h2>
    `;
    container.appendChild(div);
  });
}

// Jalankan saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
  // Ambil URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('admin') === 'true';

  // Element penting
  const staffButton = document.getElementById('toggleStaffModal');
  const modal = document.getElementById('staffModal');
  const closeModal = document.querySelector('.close');
  const submitBtn = document.getElementById('submitStaff');
  const deleteBtn = document.getElementById('confirmDeleteStaff');

  // Tampilkan tombol Staff Panel hanya jika admin
  if (staffButton) {
    staffButton.style.display = isAdmin ? 'block' : 'none';
  }

  // Buka modal saat tombol diklik
  if (staffButton && modal) {
    staffButton.onclick = () => {
      modal.style.display = 'flex'; // Gunakan flex agar modal tetap center
    };
  }

  // Tutup modal saat tombol close diklik
  if (closeModal && modal) {
    closeModal.onclick = () => {
      modal.style.display = 'none';
    };
  }

  // Submit Tambah Staff
  if (submitBtn) {
    submitBtn.onclick = async () => {
      const username = document.getElementById('username').value;
      const role = document.getElementById('role').value;
      const key = document.getElementById('adminKey').value;

      if (!username || !role || !key) return alert("Isi semua field tambah staff!");

      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role, key })
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        modal.style.display = 'none';
        loadStaff();
      }
    };
  }

  // Submit Hapus Staff
  if (deleteBtn) {
    deleteBtn.onclick = async () => {
      const username = document.getElementById('deleteUsername').value;
      const key = document.getElementById('deleteAdminKey').value;

      if (!username || !key) return alert("Isi semua field hapus staff!");

      const res = await fetch('/api/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, key })
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        modal.style.display = 'none';
        loadStaff();
      }
    };
  }

  // Load data staff saat halaman dibuka
  loadStaff();
});







// Elemen-elemen modal dan user info
const modal = document.getElementById('mcUsernameModal');
const input = document.getElementById('mcUsernameInput');
const submit = document.getElementById('submitMcUsername');

const mcUserInfo = document.getElementById('mcUserInfo');
const mcAvatar = document.getElementById('mcAvatar');
const mcName = document.getElementById('mcName');

// Saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
  const storedUsername = localStorage.getItem('mcUsername');

  if (!storedUsername) {
    modal.style.display = 'flex';
  } else {
    tampilkanUserInfo(storedUsername);
  }
});

// Submit username Minecraft
submit.onclick = () => {
  const username = input.value.trim();
  if (!username) return alert('Username tidak boleh kosong!');

  // Simpan ke localStorage
  localStorage.setItem('mcUsername', username);
  modal.style.display = 'none';

  // Langsung tampilkan avatar + username tanpa reload
  tampilkanUserInfo(username);
};

// Fungsi untuk menampilkan avatar + nama
function tampilkanUserInfo(username) {
  mcUserInfo.style.display = 'flex';
  mcAvatar.src = `https://mc-heads.net/avatar/${username}/64`;
  mcName.textContent = username;
}

// Logout langsung saat klik avatar
mcUserInfo.addEventListener('click', () => {
  localStorage.removeItem('mcUsername');
  location.reload(); // Reload supaya modal login muncul lagi
});
