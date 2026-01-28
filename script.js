document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger lines
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // AI Voice Agent - Strict One-Time Playback Logic
    const audioPath = 'audio/aivoice.wav';
    const audio = new Audio(audioPath);
    audio.preload = "auto";
    const aiBtn = document.getElementById('aiVoiceBtn');

    const forcePlay = () => {
        // ULTIMATE CHECK: Never play if already played in this session
        if (sessionStorage.getItem('ai_voice_played')) {
            console.log("Audio already played in this session. Skipping.");
            return;
        }

        audio.play().then(() => {
            console.log("Success: AI Voice started for the first (and only) time.");
            if (aiBtn) aiBtn.innerHTML = "<span>🔊 Playing...</span>";
            sessionStorage.setItem('ai_voice_played', 'true');
            removeFallbacks(); // Stop listening for movements once played
        }).catch(err => {
            console.log("Autoplay blocked. Waiting for first movement...");
        });
    };

    const removeFallbacks = () => {
        window.removeEventListener('mousemove', activateOnAction);
        window.removeEventListener('mousedown', activateOnAction);
        window.removeEventListener('touchstart', activateOnAction);
        window.removeEventListener('scroll', activateOnAction);
        window.removeEventListener('keydown', activateOnAction);
    };

    const activateOnAction = () => {
        if (!sessionStorage.getItem('ai_voice_played')) {
            forcePlay();
        } else {
            removeFallbacks();
        }
    };

    // 1. Try immediate play
    forcePlay();

    // 2. Try on full load
    window.addEventListener('load', () => {
        if (!sessionStorage.getItem('ai_voice_played')) {
            setTimeout(forcePlay, 500);
        }
    });

    // 3. Seamless fallbacks (Only if not played yet)
    window.addEventListener('mousemove', activateOnAction);
    window.addEventListener('mousedown', activateOnAction);
    window.addEventListener('touchstart', activateOnAction);
    window.addEventListener('scroll', activateOnAction);
    window.addEventListener('keydown', activateOnAction);

    // Manual control button (Always available)
    if (aiBtn) {
        aiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (audio.paused) {
                audio.play();
                aiBtn.innerHTML = "<span>🔊 Playing...</span>";
                sessionStorage.setItem('ai_voice_played', 'true');
                removeFallbacks();
            } else {
                audio.pause();
                aiBtn.innerHTML = "<span>🔊 Hear AI Agent</span>";
            }
        });
    }

    audio.onended = () => {
        if (aiBtn) aiBtn.innerHTML = "<span>🔊 Hear AI Agent</span>";
    };
});
