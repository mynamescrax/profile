let hasUserInteracted = false;

function initMedia() {
  console.log("initMedia called");
  const backgroundMusic = document.getElementById('background-music');
  const backgroundVideo = document.getElementById('background');
  if (!backgroundMusic || !backgroundVideo) {
    console.error("Media elements not found");
    return;
  }
  backgroundMusic.volume = 0.3;
  backgroundVideo.muted = true;


  backgroundVideo.play().catch(err => {
    console.error("Failed to play background video:", err);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  const backgroundMusic = document.getElementById('background-music');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const backgroundVideo = document.getElementById('background');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const profileBlock = document.getElementById('profile-block');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;


  const startMessage = "Click here to see the motion baby";
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
    }
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    setTimeout(typeWriterStart, 100);
  }


  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
  }, 500);


  async function initializeVisitorCounter() {
    try {
      const res = await fetch('/api/views', { method: 'POST' });
      const data = await res.json();
      visitorCount.textContent = Number(data.count).toLocaleString();
    } catch {
      visitorCount.textContent = '?';
    }
  }

  initializeVisitorCounter();


  startScreen.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(err => {
      console.error("Failed to play music after start screen click:", err);
    });
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );
    transparencySlider.dispatchEvent(new Event('input'));
    typeWriterName();
    typeWriterBio();
  });

  startScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startScreen.classList.add('hidden');
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(err => {
      console.error("Failed to play music after start screen touch:", err);
    });
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );
    transparencySlider.dispatchEvent(new Event('input'));
    typeWriterName();
    typeWriterBio();
  });


  const name = "crax";
  let nameText = '';
  let nameIndex = 0;
  let isNameDeleting = false;
  let nameCursorVisible = true;

  function typeWriterName() {
    if (!isNameDeleting && nameIndex < name.length) {
      nameText = name.slice(0, nameIndex + 1);
      nameIndex++;
    } else if (isNameDeleting && nameIndex > 0) {
      nameText = name.slice(0, nameIndex - 1);
      nameIndex--;
    } else if (nameIndex === name.length) {
      isNameDeleting = true;
      setTimeout(typeWriterName, 10000);
      return;
    } else if (nameIndex === 0) {
      isNameDeleting = false;
    }
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileName.classList.add('glitch');
      setTimeout(() => profileName.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterName, isNameDeleting ? 150 : 300);
  }

  setInterval(() => {
    nameCursorVisible = !nameCursorVisible;
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
  }, 500);


  const bioMessages = [
    "n1 skidder oat",
    "\"Hello, World!\"",
    "top paster",
    "\"nigger\""
  ];
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 2000);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileBio.classList.add('glitch');
      setTimeout(() => profileBio.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterBio, isBioDeleting ? 75 : 150);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
  }, 500);


  let currentAudio = backgroundMusic;
  let isMuted = false;

  volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeIcon.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeSlider.addEventListener('input', () => {
    currentAudio.volume = volumeSlider.value;
    isMuted = false;
    currentAudio.muted = false;
    volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });


  transparencySlider.addEventListener('input', () => {
    const opacity = transparencySlider.value;
    if (opacity == 0) {
      profileBlock.style.background = 'rgba(0, 0, 0, 0)';
      profileBlock.style.borderOpacity = '0';
      profileBlock.style.borderColor = 'transparent';
      profileBlock.style.backdropFilter = 'none';
      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
      visitorCount.style.opacity = '1';
    } else {
      profileBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
      profileBlock.style.borderOpacity = opacity;
      profileBlock.style.borderColor = '';
      profileBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
      visitorCount.style.opacity = '1';
    }
  });


  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    const maxTilt = 15;
    const tiltX = (mouseY / rect.height) * maxTilt;
    const tiltY = -(mouseX / rect.width) * maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  }

  profileBlock.addEventListener('mousemove', (e) => handleTilt(e, profileBlock));
  profileBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, profileBlock);
  });

  profileBlock.addEventListener('mouseleave', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  profileBlock.addEventListener('touchend', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });


  profilePicture.addEventListener('mouseenter', () => {
    glitchOverlay.style.opacity = '1';
    setTimeout(() => {
      glitchOverlay.style.opacity = '0';
    }, 500);
  });


  profilePicture.addEventListener('click', () => {
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

  profilePicture.addEventListener('touchstart', (e) => {
    e.preventDefault();
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });


  const musicProgress = document.getElementById('music-progress');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  function formatTime(s) {
    const m = Math.floor(s / 60);
    return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  function updateProgressFill() {
    const pct = (backgroundMusic.currentTime / (backgroundMusic.duration || 1)) * 100;
    musicProgress.style.background = `linear-gradient(to right, rgba(255,255,255,0.9) ${pct}%, rgba(255,255,255,0.25) ${pct}%)`;
  }

  backgroundMusic.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(backgroundMusic.duration);
    musicProgress.max = backgroundMusic.duration;
  });

  backgroundMusic.addEventListener('timeupdate', () => {
    if (!musicProgress._seeking) {
      currentTimeEl.textContent = formatTime(backgroundMusic.currentTime);
      musicProgress.value = backgroundMusic.currentTime;
      updateProgressFill();
    }
  });

  musicProgress.addEventListener('mousedown', () => { musicProgress._seeking = true; });
  musicProgress.addEventListener('touchstart', () => { musicProgress._seeking = true; });

  musicProgress.addEventListener('input', () => {
    currentTimeEl.textContent = formatTime(Number(musicProgress.value));
    const pct = (musicProgress.value / (backgroundMusic.duration || 1)) * 100;
    musicProgress.style.background = `linear-gradient(to right, rgba(255,255,255,0.9) ${pct}%, rgba(255,255,255,0.25) ${pct}%)`;
  });

  musicProgress.addEventListener('change', () => {
    backgroundMusic.currentTime = musicProgress.value;
    musicProgress._seeking = false;
  });

  backgroundMusic.addEventListener('play', () => {
    playPauseBtn.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  });

  backgroundMusic.addEventListener('pause', () => {
    playPauseBtn.innerHTML = '<path d="M8 5v14l11-7z"/>';
  });

  playPauseBtn.addEventListener('click', () => {
    if (backgroundMusic.paused) {
      backgroundMusic.muted = false;
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  });

  prevBtn.addEventListener('click', () => { backgroundMusic.currentTime = 0; });
  nextBtn.addEventListener('click', () => { backgroundMusic.currentTime = 0; });

  typeWriterStart();
});
