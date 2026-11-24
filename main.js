
const glitterContainer =
    document.getElementById("glitter-container");
const isHomePage = document.body.classList.contains("home-page");

function createGlitter() {
    if (!glitterContainer) return;

    const glitter = document.createElement("div");

    glitter.classList.add("glitter");

    const size = Math.random() * 4 + 2;

    glitter.style.width = size + "px";
    glitter.style.height = size + "px";

    glitter.style.left = Math.random() * 100 + "%";

    const duration = isHomePage
        ? Math.random() * 2 + 2.2
        : Math.random() * 6 + 5;

    glitter.style.animationDuration = duration + "s";

    glitter.style.animationDelay = isHomePage
        ? "0s"
        : Math.random() * 5 + "s";

    glitterContainer.appendChild(glitter);

    setTimeout(() => {
        glitter.remove();
    }, (duration + 5) * 1000);
}

// Continuously create floating glitter
if (glitterContainer) {
    window.setInterval(createGlitter, isHomePage ? 100 : 180);
}

// Launch one dramatic birthday cracker on the homepage
const birthdayFireworks = document.getElementById("birthday-fireworks");

if (birthdayFireworks && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const crackerColors = ["#ffe39d", "#ff7180", "#ffcb68", "#d7a8ff", "#fff1bc"];

    const getBirthdayTextSparks = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const text = "HAPPY BIRTHDAY";
        let fontSize = Math.min(112, Math.max(34, window.innerWidth * 0.09));

        context.font = `700 ${fontSize}px Cinzel, serif`;
        const maxWidth = window.innerWidth * 0.92;
        const measuredWidth = context.measureText(text).width;
        if (measuredWidth > maxWidth) {
            fontSize *= maxWidth / measuredWidth;
            context.font = `700 ${fontSize}px Cinzel, serif`;
        }

        canvas.width = Math.ceil(context.measureText(text).width);
        canvas.height = Math.ceil(fontSize * 1.25);
        context.font = `700 ${fontSize}px Cinzel, serif`;
        context.textBaseline = "top";
        context.fillText(text, 0, 0);

        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const step = Math.max(4, Math.round(fontSize / 14));
        const sparks = [];

        for (let y = 0; y < canvas.height; y += step) {
            for (let x = 0; x < canvas.width; x += step) {
                if (pixels[(y * canvas.width + x) * 4 + 3] > 96) {
                    sparks.push({
                        x: x - canvas.width / 2,
                        y: y - canvas.height / 2,
                        progress: x / canvas.width
                    });
                }
            }
        }

        return sparks;
    };

    const launchBirthdayCracker = () => {
        const burst = document.createElement("div");
        burst.className = "birthday-cracker-burst";
        burst.style.left = "50%";
        burst.style.top = "43%";

        for (let index = 0; index < 48; index += 1) {
            const spark = document.createElement("span");
            const angle = (Math.PI * 2 * index) / 48;
            const distance = 110 + Math.random() * Math.min(
                Math.min(window.innerWidth, window.innerHeight) * 0.55,
                430
            );
            spark.className = "birthday-cracker-spark";
            spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
            spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
            spark.style.setProperty(
                "--spark-color",
                crackerColors[Math.floor(Math.random() * crackerColors.length)]
            );
            burst.appendChild(spark);
        }

        getBirthdayTextSparks().forEach((point) => {
            const spark = document.createElement("span");
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * Math.min(window.innerWidth * 0.4, 500);
            spark.className = "birthday-cracker-letter-spark";
            spark.style.setProperty("--spark-x", `${point.x}px`);
            spark.style.setProperty("--spark-y", `${point.y}px`);
            spark.style.setProperty("--start-x", `${Math.cos(angle) * distance}px`);
            spark.style.setProperty("--start-y", `${Math.sin(angle) * distance}px`);
            spark.style.setProperty(
                "--spark-color",
                crackerColors[Math.floor(Math.random() * crackerColors.length)]
            );
            spark.style.animationDelay = `${0.65 + point.progress * 0.75 + Math.random() * 0.15}s`;
            burst.appendChild(spark);
        });

        birthdayFireworks.appendChild(burst);
        window.setTimeout(() => burst.remove(), 5300);
    };

    window.setTimeout(launchBirthdayCracker, 650);
}

// Reveal appreciation messages
const messageCards = document.querySelectorAll(".message-card");

messageCards.forEach((card) => {
    const revealCard = () => {
        const revealed = card.classList.toggle("revealed");
        card.setAttribute("aria-expanded", String(revealed));

        const revealText = card.querySelector(".reveal-text");
        revealText.textContent = revealed ? "Hide message" : "Tap to reveal";
    };

    card.addEventListener("click", revealCard);
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            revealCard();
        }
    });
});

// Open gallery photos in an accessible, dismissible lightbox
const photoLightbox = document.getElementById("photo-lightbox");

if (photoLightbox) {
    const lightboxImage = photoLightbox.querySelector(".lightbox-image");
    const lightboxCaption = photoLightbox.querySelector(".lightbox-caption");
    const lightboxClose = photoLightbox.querySelector(".lightbox-close");
    let lastOpenedPhoto = null;

    const closeLightbox = () => {
        photoLightbox.hidden = true;
        document.body.style.overflow = "";
        if (lastOpenedPhoto) {
            lastOpenedPhoto.focus();
        }
    };

    document.querySelectorAll(".gallery-photo").forEach((photo) => {
        photo.addEventListener("click", () => {
            const image = photo.querySelector("img");
            lastOpenedPhoto = photo;
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightboxCaption.textContent = photo.dataset.caption;
            photoLightbox.hidden = false;
            document.body.style.overflow = "hidden";
            lightboxClose.focus();
        });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    photoLightbox.addEventListener("click", (event) => {
        if (event.target === photoLightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!photoLightbox.hidden && event.key === "Escape") {
            closeLightbox();
        }
    });
}

// Reveal the handwritten letter after its envelope is opened
const letterOpenButton = document.getElementById("letter-open-button");

if (letterOpenButton) {
    const letterEnvelope = document.getElementById("letter-envelope");
    const letterBook = document.getElementById("letter-book");
    let letterOpenStarted = false;

    letterOpenButton.addEventListener("click", () => {
        if (letterOpenStarted) return;

        letterOpenStarted = true;
        letterOpenButton.setAttribute("aria-expanded", "true");
        letterOpenButton.setAttribute("aria-disabled", "true");
        letterEnvelope.classList.add("opening");

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.setTimeout(() => {
            letterEnvelope.hidden = true;
            letterBook.hidden = false;
            letterBook.setAttribute("aria-hidden", "false");
            letterBook.classList.add("book-opening");
            letterBook.focus();
        }, reducedMotion ? 20 : 900);
    });
}

// Generate a quiet instrumental ambience only after the visitor opts in
const musicToggle = document.getElementById("music-toggle");

if (musicToggle) {
    const musicLabel = musicToggle.querySelector(".music-label");
    const musicStatus = document.getElementById("music-status");
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioContext = null;
    let musicTimer = null;
    let chordIndex = 0;
    const chords = [
        [261.63, 329.63, 392.00],
        [220.00, 261.63, 329.63],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66]
    ];

    const playChord = () => {
        if (!audioContext) return;

        const now = audioContext.currentTime;
        const notes = chords[chordIndex % chords.length];
        chordIndex += 1;

        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const volume = audioContext.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            volume.gain.setValueAtTime(0.0001, now);
            volume.gain.exponentialRampToValueAtTime(index === 0 ? 0.012 : 0.008, now + 0.8);
            volume.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
            oscillator.connect(volume);
            volume.connect(audioContext.destination);
            oscillator.start(now);
            oscillator.stop(now + 4);
        });
    };

    const stopMusic = async () => {
        if (musicTimer) {
            window.clearInterval(musicTimer);
            musicTimer = null;
        }

        if (audioContext && audioContext.state !== "closed") {
            await audioContext.close();
            audioContext = null;
        }

        musicToggle.setAttribute("aria-pressed", "false");
        musicToggle.setAttribute("aria-label", "Play soft instrumental music");
        musicLabel.textContent = "Play soft music";
    };

    musicToggle.addEventListener("click", async () => {
        if (musicToggle.getAttribute("aria-pressed") === "true") {
            await stopMusic();
            musicStatus.textContent = "Music paused.";
            return;
        }

        if (!AudioContext) {
            musicStatus.textContent = "Soft music is not supported in this browser.";
            return;
        }

        try {
            audioContext = new AudioContext();
            await audioContext.resume();
            chordIndex = 0;
            playChord();
            musicTimer = window.setInterval(playChord, 3600);
            musicToggle.setAttribute("aria-pressed", "true");
            musicToggle.setAttribute("aria-label", "Mute soft instrumental music");
            musicLabel.textContent = "Mute music";
            musicStatus.textContent = "Soft instrumental ambience is playing.";
        } catch (error) {
            if (audioContext && audioContext.state !== "closed") {
                await audioContext.close();
            }
            audioContext = null;
            musicStatus.textContent = "Could not start music. Please try again.";
            console.error("Unable to start the letter page music.", error);
        }
    });
}

// Simulated cake cutting and birthday surprise
const cutCakeButton = document.getElementById("cut-cake-button");

if (cutCakeButton) {
    const cakeStage = document.getElementById("cake-stage");
    const birthdaySurprise = document.getElementById("birthday-surprise");
    const surpriseClose = birthdaySurprise.querySelector(".surprise-close");
    const surpriseCard = birthdaySurprise.querySelector(".surprise-card");
    const particleContainer = document.getElementById("celebration-particles");
    const celebrationColors = ["#ffd875", "#fff1bd", "#ff687d", "#e7a5a9", "#f7e7d0"];
    let surpriseTimer = null;
    let petalRevealTimer = null;
    let cakeCutStarted = false;

    const addParticle = (className, duration, delay) => {
        const particle = document.createElement("span");
        particle.className = className;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.setProperty(
            "--particle-color",
            celebrationColors[Math.floor(Math.random() * celebrationColors.length)]
        );
        particle.style.setProperty("--drift", `${Math.round(Math.random() * 180 - 90)}px`);

        if (className === "celebration-particle-heart") {
            particle.textContent = "♥";
            particle.style.setProperty("--particle-size", `${14 + Math.random() * 16}px`);
        } else if (className === "celebration-balloon") {
            particle.style.setProperty(
                "--balloon-color",
                celebrationColors[Math.floor(Math.random() * celebrationColors.length)]
            );
            particle.style.animationDelay = `${delay}s`;
        } else if (className === "celebration-firework" || className === "celebration-cracker") {
            particle.style.setProperty("--firework-x", `${10 + Math.random() * 80}%`);
            particle.style.setProperty("--firework-y", `${15 + Math.random() * 42}%`);
        }

        particleContainer.appendChild(particle);
        window.setTimeout(() => particle.remove(), (duration + delay + 0.5) * 1000);
    };

    const launchCelebration = () => {
        for (let index = 0; index < 56; index += 1) {
            addParticle("celebration-confetti", 3.8 + Math.random() * 2.7, Math.random() * 1.4);
        }

        for (let index = 0; index < 20; index += 1) {
            addParticle("celebration-particle-heart", 6 + Math.random() * 3, Math.random() * 1.3);
        }

        for (let index = 0; index < 10; index += 1) {
            addParticle("celebration-balloon", 7 + Math.random() * 2.5, index * 0.18);
        }

        for (let index = 0; index < 6; index += 1) {
            addParticle("celebration-firework", 1.25, index * 0.18);
        }

        for (let index = 0; index < 10; index += 1) {
            addParticle("celebration-cracker", 1.55, index * 0.12);
        }
    };

    const closeSurprise = () => {
        window.clearTimeout(petalRevealTimer);
        birthdaySurprise.hidden = true;
        surpriseCard.classList.remove("revealed");
        document.body.style.overflow = "";
        cutCakeButton.focus();
    };

    cutCakeButton.addEventListener("click", () => {
        if (cakeCutStarted) return;

        cakeCutStarted = true;
        cutCakeButton.setAttribute("aria-disabled", "true");
        cutCakeButton.setAttribute("aria-pressed", "true");
        cutCakeButton.innerHTML = "The wish is on its way! <span aria-hidden=\"true\">✨</span>";
        cakeStage.classList.add("cake-cut");
        launchCelebration();

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        surpriseTimer = window.setTimeout(() => {
            birthdaySurprise.hidden = false;
            document.body.style.overflow = "hidden";
            surpriseClose.focus();
            launchCelebration();
            petalRevealTimer = window.setTimeout(() => {
                if (!birthdaySurprise.hidden) {
                    surpriseCard.classList.add("revealed");
                }
            }, reducedMotion ? 50 : 4300);
        }, reducedMotion ? 50 : 1250);
    });

    surpriseClose.addEventListener("click", closeSurprise);
    birthdaySurprise.addEventListener("click", (event) => {
        if (event.target === birthdaySurprise) {
            closeSurprise();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!birthdaySurprise.hidden) {
            if (event.key === "Escape") {
                window.clearTimeout(surpriseTimer);
                closeSurprise();
            } else if (event.key === "Tab") {
                event.preventDefault();
                surpriseClose.focus();
            }
        }
    });
}
