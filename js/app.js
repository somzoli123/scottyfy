// 1. ADATOK: tömb objektumokkal
const songs = [
  { id: 1, title: 'Neon Horizon',   artist: 'Aurora Vale',  cover: 'assets/images/cover-1.svg', src: 'assets/music/track-1.wav' },
  { id: 2, title: 'Velvet Skyline', artist: 'Luna Drift',   cover: 'assets/images/cover-2.svg', src: 'assets/music/track-2.wav' },
  { id: 3, title: 'Midnight Echo',  artist: 'Kai Nova',     cover: 'assets/images/cover-3.svg', src: 'assets/music/track-3.wav' }
];

// 2. LOCALSTORAGE: kedvencek betöltése (JSON.parse) és mentése (JSON.stringify)
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const saveFavorites = () => localStorage.setItem('favorites', JSON.stringify(favorites));

// 3. ELEMEK ÉS ÁLLAPOT
const audio = new Audio();                    // HTML Audio API
let currentIndex = -1;
const list = document.getElementById('song-list');
const playBtn = document.getElementById('play');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');

audio.volume = Number(localStorage.getItem('volume') ?? 0.7);
volume.value = audio.volume * 100;

// 4. LISTA KIRAJZOLÁSA (DOM + ciklus + template literal)
function renderList() {
  list.innerHTML = '';
  songs.forEach((song, index) => {
    const isFav = favorites.includes(song.id);
    const li = document.createElement('li');
    li.className = index === currentIndex ? 'active' : '';
    li.innerHTML = `
      <img src="${song.cover}" alt="">
      <div class="info">${song.title}<small>${song.artist}</small></div>
      <button class="fav">${isFav ? '❤️' : '🤍'}</button>`;
    li.addEventListener('click', () => playSong(index));
    li.querySelector('.fav').addEventListener('click', event => {
      event.stopPropagation();                // ne induljon el a dal
      toggleFavorite(song.id);
    });
    list.appendChild(li);
  });
}

// 5. KEDVENCEK
function toggleFavorite(id) {
  favorites = favorites.includes(id)
    ? favorites.filter(favId => favId !== id)
    : [...favorites, id];
  saveFavorites();
  renderList();
}

// 6. LEJÁTSZÁS
function playSong(index) {
  currentIndex = index;
  const song = songs[index];
  audio.src = song.src;
  audio.play();
  document.getElementById('title').textContent = song.title;
  document.getElementById('artist').textContent = song.artist;
  document.getElementById('cover').src = song.cover;
  renderList();
}

playBtn.addEventListener('click', () => {
  if (currentIndex === -1) { playSong(0); return; }
  audio.paused ? audio.play() : audio.pause();
});
document.getElementById('next').addEventListener('click', () => playSong((currentIndex + 1) % songs.length));
document.getElementById('prev').addEventListener('click', () => playSong((currentIndex - 1 + songs.length) % songs.length));

audio.addEventListener('play',  () => playBtn.textContent = '⏸');
audio.addEventListener('pause', () => playBtn.textContent = '▶');
audio.addEventListener('ended', () => playSong((currentIndex + 1) % songs.length));
audio.addEventListener('error', () => alert('A zene nem tölthető be.'));

// 7. PROGRESS BAR ÉS HANGERŐ
audio.addEventListener('timeupdate', () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});
progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});
volume.addEventListener('input', () => {
  audio.volume = volume.value / 100;
  localStorage.setItem('volume', audio.volume);
});

renderList();