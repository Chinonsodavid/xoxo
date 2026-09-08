/**
 * VICTORIA'S CINEMATIC BIRTHDAY EXPERIENCE
 * Vanilla JavaScript Engine
 * 
 * Modules:
 * 1. Ambient Particles & Motion
 * 2. Audio Controller (Sleeping At Last - Turning Page)
 * 3. Scroll Reveals & Chapter Navigation
 * 4. Video Viewport Autoplay Engine
 * 5. Deferred Three.js 3D Earth (Nigeria -> USA Golden Arc)
 * 6. Tactile Envelope & Wax Seal Letter Reader
 * 7. Documentary Media Lightbox
 * 8. Returning Visitor Logic
 */

(function () {
  'use strict';

  // --- Reduced Motion Check ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. AMBIENT PARTICLES (Micro Gold Dust)
     ========================================================================== */
  function initAmbientParticles() {
    if (prefersReducedMotion) return;
    const canvas = document.getElementById('ambient-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const particleCount = window.innerWidth < 768 ? 22 : 45;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.45 + 0.15,
        vy: -(Math.random() * 0.28 + 0.08),
        vx: (Math.random() - 0.5) * 0.18,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseVal: Math.random() * Math.PI
      });
    }

    let animId;
    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx;
        p.pulseVal += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const dynamicAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulseVal));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 197, 123, ${dynamicAlpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    }

    render();
  }

  /* ==========================================================================
     0. PRELOADER & SOUND ENTRY MODAL
     ========================================================================== */
  function initPreloaderAndSoundModal() {
    const preloader = document.getElementById('preloader-overlay');
    const progressBar = document.getElementById('preloader-progress-bar');
    const percentText = document.getElementById('preloader-percent');
    const statusText = document.getElementById('preloader-status');
    const soundModal = document.getElementById('sound-modal-overlay');
    const btnSoundPlay = document.getElementById('btn-sound-play');
    const btnSoundMute = document.getElementById('btn-sound-mute');
    const heroBg = document.getElementById('hero-bg');
    const audio = document.getElementById('bg-audio');

    const criticalAssets = [
      'assets/images/portrait-hero.jpg',
      'assets/images/birthday-gift.jpg',
      'assets/images/fedora-smile.jpg',
      'assets/images/fedora-poised.jpg',
      'assets/images/gown-standing.jpg',
      'assets/images/earth-texture.png'
    ];

    let loadedCount = 0;
    const totalAssets = criticalAssets.length;
    let isComplete = false;

    function updateProgress(count) {
      const targetPercent = Math.min(100, Math.round((count / totalAssets) * 100));
      if (progressBar) progressBar.style.width = targetPercent + '%';
      if (percentText) percentText.textContent = targetPercent + '%';

      if (targetPercent >= 100) {
        onLoadingComplete();
      }
    }

    function onLoadingComplete() {
      if (isComplete) return;
      isComplete = true;

      if (statusText) statusText.textContent = 'Welcome, Victoria';
      if (progressBar) progressBar.style.width = '100%';
      if (percentText) percentText.textContent = '100%';

      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
        setTimeout(() => {
          if (soundModal) soundModal.classList.add('is-active');
        }, 300);
      }, 500);
    }

    criticalAssets.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        updateProgress(loadedCount);
      };
      img.onerror = () => {
        loadedCount++;
        updateProgress(loadedCount);
      };
      img.src = src;
    });

    // Safety fallback: ensure loading concludes within 2.5s even on slow connections
    setTimeout(() => {
      if (!isComplete) onLoadingComplete();
    }, 2500);

    function enterExperience(withSound) {
      if (soundModal) soundModal.classList.remove('is-active');
      if (heroBg) heroBg.classList.add('is-visible');

      if (withSound && audio) {
        audio.volume = 0.65;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('Audio playback notice:', err);
          });
        }
      }
    }

    if (btnSoundPlay) {
      btnSoundPlay.addEventListener('click', () => enterExperience(true));
    }
    if (btnSoundMute) {
      btnSoundMute.addEventListener('click', () => enterExperience(false));
    }
  }

  /* ==========================================================================
     2. AUDIO CONTROLLER
     ========================================================================== */
  function initAudioController() {
    const audio = document.getElementById('bg-audio');
    const controller = document.getElementById('audio-controller');
    const playBtn = document.getElementById('audio-play-toggle');
    const iconPlay = document.getElementById('audio-icon-play');
    const iconPause = document.getElementById('audio-icon-pause');
    const inviteToast = document.getElementById('audio-invite');

    if (!audio || !controller || !playBtn) return;

    audio.volume = 0.65;

    // Show invite toast briefly on first arrival
    setTimeout(() => {
      if (audio.paused && inviteToast) {
        inviteToast.classList.add('visible');
        setTimeout(() => inviteToast.classList.remove('visible'), 6000);
      }
    }, 2800);

    function setPlayingState(isPlaying) {
      if (isPlaying) {
        controller.classList.add('playing');
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        if (inviteToast) inviteToast.classList.remove('visible');
        localStorage.setItem('victoria_audio_preferred', 'true');
      } else {
        controller.classList.remove('playing');
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        localStorage.setItem('victoria_audio_preferred', 'false');
      }
    }

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          setPlayingState(true);
        }).catch(err => {
          console.log('Audio autoplay prevented:', err);
        });
      } else {
        audio.pause();
        setPlayingState(false);
      }
    });

    audio.addEventListener('play', () => setPlayingState(true));
    audio.addEventListener('pause', () => setPlayingState(false));

    // Optional user interaction initial unlock (subtle, non-intrusive)
    const unlockAudioOnce = () => {
      const preferred = localStorage.getItem('victoria_audio_preferred');
      if (preferred === 'true' && audio.paused) {
        audio.play().then(() => setPlayingState(true)).catch(() => {});
      }
      window.removeEventListener('click', unlockAudioOnce);
      window.removeEventListener('touchstart', unlockAudioOnce);
    };
    window.addEventListener('click', unlockAudioOnce, { once: true });
    window.addEventListener('touchstart', unlockAudioOnce, { once: true });
  }

  /* ==========================================================================
     3. SCROLL REVEALS & CHAPTER NAVIGATION
     ========================================================================== */
  function initScrollReveals() {
    // Hero background smooth emergence
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
      setTimeout(() => heroBg.classList.add('is-visible'), 200);
    }

    // Reveal elements on scroll
    const reveals = document.querySelectorAll('.reveal-fade');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
      });

      reveals.forEach(el => revealObserver.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('is-visible'));
    }

    // Chapter navigation active tracking
    const sections = document.querySelectorAll('main > section');
    const nav = document.getElementById('chapter-nav');
    const dots = document.querySelectorAll('.chapter-dot');

    if (sections.length && nav && 'IntersectionObserver' in window) {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            dots.forEach(dot => {
              if (dot.getAttribute('href') === `#${id}`) {
                dot.classList.add('current');
              } else {
                dot.classList.remove('current');
              }
            });

            // Show chapter nav only after leaving hero
            if (id !== 'hero') {
              nav.classList.add('active');
            } else {
              nav.classList.remove('active');
            }
          }
        });
      }, {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
      });

      sections.forEach(sec => navObserver.observe(sec));
    }
  }

  /* ==========================================================================
     4. VIEWPORT-AWARE VIDEO AUTOPLAY ENGINE
     ========================================================================== */
  function initVideoAutoplay() {
    const videos = document.querySelectorAll('.moments-wall video');
    if (!videos.length || !('IntersectionObserver' in window)) return;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          // Play only if muted to comply with browser policies
          video.muted = true;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Gracefully handle any browser pause restriction
            });
          }
        } else {
          video.pause();
        }
      });
    }, {
      root: null,
      threshold: 0.35
    });

    videos.forEach(v => videoObserver.observe(v));
  }

  /* ==========================================================================
     5. DEFERRED THREE.JS 3D EARTH (NIGERIA -> USA GOLDEN ARC)
     ========================================================================== */
  let threeLoaded = false;
  let threeLoading = false;

  function initMilesApartObserver() {
    const milesSection = document.getElementById('miles-apart');
    const viewport = document.getElementById('globe-viewport');
    if (!milesSection || !viewport) return;

    // Trigger dynamic load of Three.js ONLY when user scrolls near Miles Apart
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !threeLoaded && !threeLoading && !prefersReducedMotion) {
            threeLoading = true;
            loadThreeAndRenderGlobe();
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '350px 0px 350px 0px',
        threshold: 0.01
      });

      observer.observe(milesSection);
    }
  }

  function loadThreeAndRenderGlobe() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => {
      threeLoaded = true;
      initThreeGlobe();
    };
    script.onerror = () => {
      console.warn('Three.js CDN load failed or offline, fallback SVG remains active.');
    };
    document.body.appendChild(script);
  }

  function initThreeGlobe() {
    if (typeof THREE === 'undefined') return;

    const container = document.getElementById('globe-canvas-container');
    const fallback = document.getElementById('globe-fallback');
    const labelNigeria = document.getElementById('globe-label-nigeria');
    const labelUSA = document.getElementById('globe-label-usa');
    const dragHint = document.getElementById('globe-drag-hint');
    const viewport = document.getElementById('globe-viewport');
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 235);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Fade out fallback SVG once 3D canvas is ready
    if (fallback) {
      fallback.style.opacity = '0';
      setTimeout(() => { fallback.style.display = 'none'; }, 800);
    }

    // 1. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.0);
    keyLight.position.set(120, 80, 140);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc5a059, 1.4);
    rimLight.position.set(-140, -40, -110);
    scene.add(rimLight);

    // 2. Earth Mesh with High-Detail Luxury Texture
    const sphereRadius = 76;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('assets/images/earth-texture.png', () => {
      renderer.render(scene, camera);
    });
    earthTexture.generateMipmaps = true;

    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.12
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earthMesh);

    // 3. Atmospheric Rim Glow (Fresnel Shader Aura)
    const glowGeo = new THREE.SphereGeometry(sphereRadius + 3.5, 48, 48);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.82, 0.68, 0.38, 1.0) * intensity * 0.95;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // Helper: Convert Lat/Lon to 3D Vector3 Cartesian Coordinates
    function latLonToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    // Coordinates:
    // Nigeria (Gloria): 9.08° N, 8.67° E
    // USA (Victoria): 38.0° N, -97.0° W
    const posNigeria = latLonToVector3(9.08, 8.67, sphereRadius + 0.5);
    const posUSA = latLonToVector3(38.0, -97.0, sphereRadius + 0.5);

    // 4. Luminous Location Beacons
    function createLocationBeacon(pos) {
      const beaconGroup = new THREE.Group();

      // Pin core
      const pinMesh = new THREE.Mesh(
        new THREE.SphereGeometry(2.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfff0b8 })
      );
      beaconGroup.add(pinMesh);

      // Light stem rising radially
      const normal = pos.clone().normalize();
      const stemGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xe5c57b, transparent: true, opacity: 0.9 });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      stemMesh.position.copy(normal.clone().multiplyScalar(3));
      beaconGroup.add(stemMesh);

      // Top beacon light
      const capMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      capMesh.position.copy(normal.clone().multiplyScalar(6));
      beaconGroup.add(capMesh);

      // Pulsing base ring on surface
      const ringGeo = new THREE.RingGeometry(2.5, 5.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc5a059,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      beaconGroup.add(ringMesh);

      beaconGroup.position.copy(pos);
      return { group: beaconGroup, ring: ringMesh };
    }

    const beaconNigeria = createLocationBeacon(posNigeria);
    const beaconUSA = createLocationBeacon(posUSA);
    globeGroup.add(beaconNigeria.group);
    globeGroup.add(beaconUSA.group);

    // 5. Golden Transatlantic 3D Flight Arc
    const midPoint = new THREE.Vector3().addVectors(posNigeria, posUSA).multiplyScalar(0.5);
    const distance = posNigeria.distanceTo(posUSA);
    midPoint.normalize().multiplyScalar(sphereRadius + distance * 0.42);

    const arcCurve = new THREE.QuadraticBezierCurve3(posNigeria, midPoint, posUSA);

    // Tube mesh for the illuminated golden trajectory
    const tubeGeo = new THREE.TubeGeometry(arcCurve, 64, 0.75, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xfadb7f,
      transparent: true,
      opacity: 0.88
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    globeGroup.add(tubeMesh);

    // 6. Traveling Love Sparks / Comets along the arc
    const spark1 = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    const spark2 = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffe699, transparent: true, opacity: 0.7 })
    );
    globeGroup.add(spark1);
    globeGroup.add(spark2);

    // 7. Optimal Atlantic View Framing
    // At rotY ~5.50 (315°), the Atlantic is centered, USA is on left, Nigeria on right
    let targetRotY = 5.50;
    let targetRotX = 0.22;
    globeGroup.rotation.y = targetRotY;
    globeGroup.rotation.x = targetRotX;

    // 8. Interactive Pointer Drag Exploration
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    function onPointerDown(e) {
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
      if (dragHint) dragHint.style.opacity = '0';
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerX;
      const deltaY = e.clientY - previousPointerY;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;

      targetRotY += deltaX * 0.006;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX + deltaY * 0.006));
    }

    function onPointerUp() {
      isDragging = false;
    }

    if (viewport) {
      viewport.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    // Handle Resize
    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }, { passive: true });

    // 9. Update Screen-Space Dynamic HTML Labels
    function updateLabelPosition(posVec, labelEl) {
      if (!labelEl) return;
      const worldPos = posVec.clone().applyMatrix4(globeGroup.matrixWorld);

      // Check if location is facing front hemisphere
      const cameraDir = camera.position.clone().sub(worldPos).normalize();
      const surfaceNormal = worldPos.clone().normalize();
      const dot = surfaceNormal.dot(cameraDir);

      if (dot > 0.12) {
        worldPos.project(camera);
        const screenX = (worldPos.x * 0.5 + 0.5) * container.clientWidth;
        const screenY = (-(worldPos.y * 0.5) + 0.5) * container.clientHeight;
        labelEl.style.transform = `translate(-50%, -100%) translate(${screenX}px, ${screenY - 14}px)`;
        labelEl.style.opacity = '1';
      } else {
        labelEl.style.opacity = '0';
      }
    }

    // 10. Animation & Render Loop
    let startTime = performance.now();
    let animFrame;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;

      // Smooth damping interpolation toward target rotation
      globeGroup.rotation.y += (targetRotY - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.08;

      // Gentle auto-drift if user is not actively dragging
      if (!isDragging) {
        targetRotY += 0.0007;
      }

      // Pulse beacon rings
      const pulse = 1.0 + 0.35 * Math.sin(currentTime * 0.004);
      beaconNigeria.ring.scale.set(pulse, pulse, pulse);
      beaconUSA.ring.scale.set(pulse, pulse, pulse);

      // Travel sparks along the transatlantic arc (Nigeria -> USA)
      const t1 = (currentTime * 0.00028) % 1.0;
      const t2 = Math.max(0, (t1 - 0.04));
      spark1.position.copy(arcCurve.getPoint(t1));
      spark2.position.copy(arcCurve.getPoint(t2));

      // Update screen-space labels
      updateLabelPosition(posNigeria, labelNigeria);
      updateLabelPosition(posUSA, labelUSA);

      renderer.render(scene, camera);
      animFrame = requestAnimationFrame(animate);
    }

    animFrame = requestAnimationFrame(animate);

    // Pause heavy rendering when out of view
    if ('IntersectionObserver' in window) {
      const visObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!animFrame) animFrame = requestAnimationFrame(animate);
          } else {
            if (animFrame) {
              cancelAnimationFrame(animFrame);
              animFrame = null;
            }
          }
        });
      }, { threshold: 0.05 });
      visObserver.observe(container);
    }
  }

  /* ==========================================================================
     6. TACTILE ENVELOPE & WAX SEAL LETTER MODAL
     ========================================================================== */
  function initLetterInteraction() {
    const envelopeTrigger = document.getElementById('envelope-trigger');
    const waxSeal = document.getElementById('wax-seal');
    const modal = document.getElementById('letter-modal');
    const closeBtn = document.getElementById('letter-close-btn');
    const bannerLetterBtn = document.getElementById('btn-banner-letter');
    const finaleLetterBtn = document.getElementById('btn-read-again');

    function openLetter() {
      if (waxSeal) waxSeal.classList.add('broken');
      setTimeout(() => {
        if (modal) {
          modal.classList.add('is-open');
          document.body.style.overflow = 'hidden';
          closeBtn.focus();
        }
      }, 450);
    }

    function closeLetter() {
      if (modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }

    if (envelopeTrigger) {
      envelopeTrigger.addEventListener('click', openLetter);
      envelopeTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLetter();
        }
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLetter);
    if (bannerLetterBtn) {
      bannerLetterBtn.addEventListener('click', () => {
        const banner = document.getElementById('welcome-back-banner');
        if (banner) banner.classList.remove('visible');
        openLetter();
      });
    }
    if (finaleLetterBtn) finaleLetterBtn.addEventListener('click', openLetter);

    // Close on backdrop click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLetter();
      });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        closeLetter();
      }
    });
  }

  /* ==========================================================================
     7. DOCUMENTARY MEDIA LIGHTBOX
     ========================================================================== */
  function initLightbox() {
    const cards = document.querySelectorAll('.moment-card');
    const modal = document.getElementById('lightbox-modal');
    const container = document.getElementById('lightbox-media-container');
    const captionEl = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close-btn');

    if (!modal || !container) return;

    function openLightbox(card) {
      const type = card.getAttribute('data-type');
      const src = card.getAttribute('data-src');
      const caption = card.getAttribute('data-caption') || '';

      container.innerHTML = '';
      captionEl.textContent = caption;

      if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        // Unmute in modal so Victoria can hear the laughter and music!
        video.muted = false;
        container.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = caption;
        container.appendChild(img);
      }

      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
      // Stop and clean up any playing video inside modal
      const video = container.querySelector('video');
      if (video) {
        video.pause();
        video.src = '';
      }
      container.innerHTML = '';
    }

    cards.forEach(card => {
      card.addEventListener('click', () => openLightbox(card));
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(card);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeLightbox();
      }
    });
  }

  /* ==========================================================================
     8. RETURNING VISITOR LOGIC & REPLAY CONTROLS
     ========================================================================== */
  function initReturningVisitorLogic() {
    const banner = document.getElementById('welcome-back-banner');
    const closeBtn = document.getElementById('btn-banner-close');
    const replayBtn = document.getElementById('btn-banner-replay');
    const continueBtn = document.getElementById('btn-banner-continue');
    const finaleReplayBtn = document.getElementById('btn-replay');

    const hasVisited = localStorage.getItem('victoria_has_visited');

    if (hasVisited === 'true' && banner) {
      setTimeout(() => banner.classList.add('visible'), 1200);
    } else {
      localStorage.setItem('victoria_has_visited', 'true');
    }

    if (closeBtn && banner) {
      closeBtn.addEventListener('click', () => {
        banner.classList.remove('visible');
      });
    }

    function replayExperience() {
      if (banner) banner.classList.remove('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function continueExperience() {
      if (banner) banner.classList.remove('visible');
      const target = document.getElementById('ninth-month');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (replayBtn) replayBtn.addEventListener('click', replayExperience);
    if (continueBtn) continueBtn.addEventListener('click', continueExperience);
    if (finaleReplayBtn) finaleReplayBtn.addEventListener('click', replayExperience);
  }

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloaderAndSoundModal();
    initAmbientParticles();
    initAudioController();
    initScrollReveals();
    initVideoAutoplay();
    initMilesApartObserver();
    initLetterInteraction();
    initLightbox();
    initReturningVisitorLogic();
  });

})();
