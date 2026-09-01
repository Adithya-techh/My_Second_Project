/**
 * ============================================================================
 * STUDENT-GUIDE.JS - Procedural 3D Student Character Avatar & Scroll Guide
 * ============================================================================
 */

(function () {
  'use strict';

  window.ThreeApp = window.ThreeApp || {};
  const App = window.ThreeApp;

  // Character Components
  let guideGroup;
  let headGroup, bodyGroup, leftArmGroup, rightArmGroup;
  let tasselMesh, droneGroup, coreRingMesh;
  let leftEye, rightEye, mouthMesh;
  let holographicItem;

  // Audio Context for synthetic speech blips
  let audioCtx = null;
  let soundEnabled = true;

  // Target Transform States per section
  const sectionTransforms = {
    hero: {
      pos: { x: 2.2, y: 0.1, z: 4.2 },
      rot: { x: 0.05, y: -0.35, z: 0.0 },
      pose: 'wave',
      badge: 'WELCOME',
      speech: "Hi there! I'm Adithya's 3D AI Guide. Welcome to his portfolio! Scroll down to discover his coding journey, skills, and projects."
    },
    about: {
      pos: { x: -2.3, y: -0.1, z: 4.0 },
      rot: { x: 0.05, y: 0.45, z: 0.0 },
      pose: 'present',
      badge: 'ABOUT ADITHYA',
      speech: "Adithya is a passionate student passionate about WebGL 3D, modern web development, and AI engineering. He loves turning logic into art!"
    },
    skills: {
      pos: { x: 2.2, y: 0.0, z: 3.9 },
      rot: { x: 0.05, y: -0.4, z: 0.0 },
      pose: 'scan',
      badge: 'SKILLS & TECH',
      speech: "Here is Adithya's tech stack: HTML5, CSS3, JavaScript, Three.js, Python, and AI prompt engineering tools. Hover over any skill to see details!"
    },
    projects: {
      pos: { x: -2.4, y: 0.1, z: 4.0 },
      rot: { x: 0.05, y: 0.45, z: 0.0 },
      pose: 'inspect',
      badge: 'FEATURED WORK',
      speech: "Check out these featured projects! From interactive 3D portfolios to AI study bots and algorithm visualizers, each one was built from scratch."
    },
    terminal: {
      pos: { x: 2.3, y: -0.1, z: 4.1 },
      rot: { x: 0.08, y: -0.42, z: 0.0 },
      pose: 'think',
      badge: 'AI TERMINAL',
      speech: "Welcome to the AI Terminal playground! Type 'help', 'about', or 'projects' into the prompt below, or click any of the quick command buttons."
    },
    education: {
      pos: { x: -2.2, y: 0.0, z: 4.0 },
      rot: { x: 0.05, y: 0.4, z: 0.0 },
      pose: 'guide',
      badge: 'LEARNING PATH',
      speech: "Here is the learning roadmap—from writing his first lines of code to building full-stack intelligent systems and 3D web applications."
    },
    contact: {
      pos: { x: 2.1, y: 0.2, z: 4.3 },
      rot: { x: 0.02, y: -0.3, z: 0.0 },
      pose: 'cheer',
      badge: 'GET IN TOUCH',
      speech: "Thanks for visiting! Have a question, collaboration idea, or internship opportunity? Drop a message or copy Adithya's email above!"
    }
  };

  let currentSection = 'hero';
  let currentPose = 'wave';
  let currentPos = { x: 2.2, y: 0.1, z: 4.2 };
  let currentRot = { x: 0.05, y: -0.35, z: 0.0 };

  // Speech typewriter state
  let typewriterTimeout = null;
  let isTyping = false;

  function initGuide() {
    if (!App.scene) {
      setTimeout(initGuide, 50);
      return;
    }

    guideGroup = new THREE.Group();
    guideGroup.position.set(currentPos.x, currentPos.y, currentPos.z);
    guideGroup.rotation.set(currentRot.x, currentRot.y, currentRot.z);

    // Build the 3D procedural student model
    buildStudentAvatar();

    // Build Companion Drone
    buildCompanionDrone();

    App.scene.add(guideGroup);

    // Setup HUD event bindings
    setupHudEvents();

    // Initial typewriter speech
    triggerSpeech(sectionTransforms.hero.speech, sectionTransforms.hero.badge);

    // Register into App
    App.StudentGuide = {
      update: updateAvatar,
      setSection: setSection,
      triggerSpeech: triggerSpeech,
      toggleSound: toggleSound,
      isSoundEnabled: () => soundEnabled
    };

    // Listen to scroll events
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial check
    onScroll();
  }

  /* --------------------------------------------------------------------------
     PROCEDURAL 3D STUDENT MODEL BUILDER
     -------------------------------------------------------------------------- */
  function buildStudentAvatar() {
    // Custom Materials with Cyber Aesthetic
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdfba,
      roughness: 0.4,
      metalness: 0.1
    });

    const jacketMaterial = new THREE.MeshStandardMaterial({
      color: 0x182035,
      roughness: 0.5,
      metalness: 0.3
    });

    const cyanGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });

    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0x111625,
      roughness: 0.3,
      metalness: 0.4
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffa500,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.8
    });

    const glassVisorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transmission: 0.7,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.2,
      ior: 1.5
    });

    // 1. HEAD GROUP
    headGroup = new THREE.Group();
    headGroup.position.set(0, 1.4, 0);

    // Head Mesh (Smooth sphere)
    const headGeom = new THREE.SphereGeometry(0.55, 32, 32);
    const headMesh = new THREE.Mesh(headGeom, skinMaterial);
    headGroup.add(headMesh);

    // Cool Student Graduation Cap (Mortarboard)
    const capTopGeom = new THREE.BoxGeometry(0.9, 0.05, 0.9);
    const capTop = new THREE.Mesh(capTopGeom, capMaterial);
    capTop.position.set(0, 0.55, 0);
    capTop.rotation.y = Math.PI / 4;
    headGroup.add(capTop);

    const capSkullGeom = new THREE.CylinderGeometry(0.42, 0.46, 0.22, 24);
    const capSkull = new THREE.Mesh(capSkullGeom, capMaterial);
    capSkull.position.set(0, 0.45, 0);
    headGroup.add(capSkull);

    // Cap Golden Center Button & Tassel
    const buttonGeom = new THREE.SphereGeometry(0.045, 16, 16);
    const buttonMesh = new THREE.Mesh(buttonGeom, goldMaterial);
    buttonMesh.position.set(0, 0.58, 0);
    headGroup.add(buttonMesh);

    // Dangling Tassel
    const tasselGeom = new THREE.CylinderGeometry(0.015, 0.03, 0.35, 8);
    tasselMesh = new THREE.Mesh(tasselGeom, goldMaterial);
    tasselMesh.position.set(0.38, 0.42, 0.38);
    tasselMesh.rotation.z = -0.3;
    headGroup.add(tasselMesh);

    // Cyber Glasses / Visor
    const visorGeom = new THREE.CylinderGeometry(0.57, 0.57, 0.16, 32, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
    const visorMesh = new THREE.Mesh(visorGeom, glassVisorMaterial);
    visorMesh.position.set(0, 0.05, 0);
    visorMesh.rotation.y = Math.PI / 2;
    headGroup.add(visorMesh);

    // Glowing Eyes behind visor
    const eyeGeom = new THREE.SphereGeometry(0.065, 16, 16);
    leftEye = new THREE.Mesh(eyeGeom, cyanGlowMaterial);
    leftEye.position.set(0.18, 0.06, 0.48);
    rightEye = new THREE.Mesh(eyeGeom, cyanGlowMaterial);
    rightEye.position.set(-0.18, 0.06, 0.48);
    headGroup.add(leftEye);
    headGroup.add(rightEye);

    // Smiling / Expressive Mouth
    const mouthGeom = new THREE.TorusGeometry(0.12, 0.02, 8, 16, Math.PI * 0.7);
    mouthMesh = new THREE.Mesh(mouthGeom, cyanGlowMaterial);
    mouthMesh.position.set(0, -0.18, 0.48);
    mouthMesh.rotation.z = Math.PI * 0.85;
    headGroup.add(mouthMesh);

    // Tech Headset Earcups
    const earcupGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const leftEarcup = new THREE.Mesh(earcupGeom, cyanGlowMaterial);
    leftEarcup.rotation.z = Math.PI / 2;
    leftEarcup.position.set(0.55, 0.05, 0);
    const rightEarcup = new THREE.Mesh(earcupGeom, cyanGlowMaterial);
    rightEarcup.rotation.z = Math.PI / 2;
    rightEarcup.position.set(-0.55, 0.05, 0);
    headGroup.add(leftEarcup);
    headGroup.add(rightEarcup);

    guideGroup.add(headGroup);

    // 2. BODY / TORSO GROUP
    bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, 0.45, 0);

    // Stylized Hoodie / Jacket Torso
    const torsoGeom = new THREE.CylinderGeometry(0.42, 0.48, 0.95, 24);
    const torsoMesh = new THREE.Mesh(torsoGeom, jacketMaterial);
    bodyGroup.add(torsoMesh);

    // Glowing Chest Emblem / Core
    const coreGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const coreMesh = new THREE.Mesh(coreGeom, cyanGlowMaterial);
    coreMesh.position.set(0, 0.12, 0.42);
    bodyGroup.add(coreMesh);

    // Orbiting Core Ring
    const coreRingGeom = new THREE.TorusGeometry(0.18, 0.02, 8, 24);
    coreRingMesh = new THREE.Mesh(coreRingGeom, goldMaterial);
    coreRingMesh.position.set(0, 0.12, 0.42);
    bodyGroup.add(coreRingMesh);

    // Collar Detail
    const collarGeom = new THREE.TorusGeometry(0.38, 0.06, 12, 24);
    const collarMesh = new THREE.Mesh(collarGeom, cyanGlowMaterial);
    collarMesh.position.set(0, 0.46, 0);
    collarMesh.rotation.x = Math.PI / 2;
    bodyGroup.add(collarMesh);

    guideGroup.add(bodyGroup);

    // 3. ARMS & HANDS
    // Right Arm (User's right / avatar's left)
    rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.58, 0.85, 0);
    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.5, 16), jacketMaterial);
    rightUpperArm.position.set(0, -0.25, 0);
    rightArmGroup.add(rightUpperArm);
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), skinMaterial);
    rightHand.position.set(0, -0.55, 0);
    rightArmGroup.add(rightHand);
    guideGroup.add(rightArmGroup);

    // Left Arm (User's left / avatar's right) - Primary waving / gesturing arm
    leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.58, 0.85, 0);
    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.5, 16), jacketMaterial);
    leftUpperArm.position.set(0, -0.25, 0);
    leftArmGroup.add(leftUpperArm);
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), skinMaterial);
    leftHand.position.set(0, -0.55, 0);
    leftArmGroup.add(leftHand);
    guideGroup.add(leftArmGroup);

    // 4. FLOATING HOLOGRAPHIC CUBE / ITEM
    const holoGeom = new THREE.OctahedronGeometry(0.22, 0);
    holographicItem = new THREE.Mesh(holoGeom, cyanGlowMaterial);
    holographicItem.position.set(0.65, 0.5, 0.6);
    guideGroup.add(holographicItem);
  }

  /* --------------------------------------------------------------------------
     COMPANION DRONE / ROBOT ORB
     -------------------------------------------------------------------------- */
  function buildCompanionDrone() {
    droneGroup = new THREE.Group();
    droneGroup.position.set(1.2, 1.6, 0.5);

    const droneMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2
    });

    const droneEyeMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 1.0
    });

    // Drone Body Sphere
    const droneSphere = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), droneMat);
    droneGroup.add(droneSphere);

    // Glowing Single Eye
    const droneEye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), droneEyeMat);
    droneEye.position.set(0, 0, 0.15);
    droneGroup.add(droneEye);

    // Spinning Outer Ring
    const droneRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.26, 0.02, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6 })
    );
    droneRing.name = 'droneRing';
    droneGroup.add(droneRing);

    guideGroup.add(droneGroup);
  }

  /* --------------------------------------------------------------------------
     SYNTHETIC WEB AUDIO SPEECH BLIP GENERATOR
     -------------------------------------------------------------------------- */
  function playSpeechBlip() {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Cyber blip tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450 + Math.random() * 300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 200, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
      soundBtn.title = soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX';
    }
    return soundEnabled;
  }

  /* --------------------------------------------------------------------------
     HUD SPEECH CONTROLLER WITH TYPEWRITER EFFECT
     -------------------------------------------------------------------------- */
  function triggerSpeech(text, badgeText) {
    const textEl = document.getElementById('hud-speech-text');
    const badgeEl = document.getElementById('hud-section-name');

    if (badgeEl && badgeText) {
      badgeEl.textContent = badgeText;
    }

    if (!textEl) return;

    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
    }

    textEl.textContent = '';
    isTyping = true;
    let index = 0;

    function typeChar() {
      if (index < text.length) {
        textEl.textContent += text.charAt(index);
        
        // Play blip sound occasionally on alphanumeric characters
        if (index % 3 === 0 && /[a-zA-Z0-9]/.test(text.charAt(index))) {
          playSpeechBlip();
        }

        index++;
        typewriterTimeout = setTimeout(typeChar, 22);
      } else {
        isTyping = false;
      }
    }

    typeChar();
  }

  function setupHudEvents() {
    const minimizeBtn = document.getElementById('hud-minimize-btn');
    const hudContainer = document.getElementById('guide-hud');
    const soundBtn = document.getElementById('sound-toggle-btn');

    if (minimizeBtn && hudContainer) {
      minimizeBtn.addEventListener('click', () => {
        hudContainer.classList.toggle('minimized');
        const isMin = hudContainer.classList.contains('minimized');
        minimizeBtn.innerHTML = isMin ? '<i class="fa-solid fa-chevron-up"></i>' : '<i class="fa-solid fa-chevron-down"></i>';
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', toggleSound);
    }

    // Quick Section Chips Click
    const chips = document.querySelectorAll('.hud-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const targetId = chip.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     SCROLL & SECTION INTERPOLATION
     -------------------------------------------------------------------------- */
  function onScroll() {
    const sections = ['hero', 'about', 'skills', 'projects', 'terminal', 'education', 'contact'];
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;

    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionEl = document.getElementById(sections[i]);
      if (sectionEl) {
        const top = sectionEl.offsetTop;
        if (scrollPosition >= top) {
          if (currentSection !== sections[i]) {
            setSection(sections[i]);
          }
          break;
        }
      }
    }
  }

  function setSection(sectionId) {
    if (!sectionTransforms[sectionId]) return;

    currentSection = sectionId;
    const config = sectionTransforms[sectionId];
    currentPose = config.pose;

    // Trigger speech text
    triggerSpeech(config.speech, config.badge);

    // Update active state in nav bar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     ANIMATION LOOP & POSE ENGINE
     -------------------------------------------------------------------------- */
  function updateAvatar(elapsedTime, delta) {
    if (!guideGroup) return;

    const targetConfig = sectionTransforms[currentSection] || sectionTransforms.hero;
    const mouse = App.mouse || { x: 0, y: 0 };

    // 1. Smoothly interpolate position towards active section target
    const ease = 0.05;
    currentPos.x += (targetConfig.pos.x - currentPos.x) * ease;
    currentPos.y += (targetConfig.pos.y - currentPos.y) * ease;
    currentPos.z += (targetConfig.pos.z - currentPos.z) * ease;

    currentRot.x += (targetConfig.rot.x - currentRot.x) * ease;
    currentRot.y += (targetConfig.rot.y - currentRot.y) * ease;
    currentRot.z += (targetConfig.rot.z - currentRot.z) * ease;

    // Floating idle breath bob
    const floatY = Math.sin(elapsedTime * 2.2) * 0.08;
    const floatRot = Math.cos(elapsedTime * 1.5) * 0.02;

    guideGroup.position.set(
      currentPos.x,
      currentPos.y + floatY,
      currentPos.z
    );

    guideGroup.rotation.set(
      currentRot.x + floatRot,
      currentRot.y + mouse.x * 0.15,
      currentRot.z
    );

    // 2. Head Tracking towards mouse cursor
    if (headGroup) {
      headGroup.rotation.y = mouse.x * 0.45;
      headGroup.rotation.x = -mouse.y * 0.35;
      headGroup.position.y = 1.4 + Math.sin(elapsedTime * 2.2) * 0.015;
    }

    // 3. Tassel physics swing
    if (tasselMesh) {
      tasselMesh.rotation.z = -0.3 + Math.sin(elapsedTime * 3) * 0.08 + mouse.x * 0.1;
    }

    // 4. Core ring rotation
    if (coreRingMesh) {
      coreRingMesh.rotation.z = elapsedTime * 2;
    }

    // 5. Holographic item rotation & float
    if (holographicItem) {
      holographicItem.rotation.x = elapsedTime * 1.5;
      holographicItem.rotation.y = elapsedTime * 2.0;
      holographicItem.position.y = 0.5 + Math.sin(elapsedTime * 3) * 0.08;
    }

    // 6. Companion Drone Orbiting
    if (droneGroup) {
      const droneAngle = elapsedTime * 1.2;
      droneGroup.position.x = Math.cos(droneAngle) * 1.3;
      droneGroup.position.z = Math.sin(droneAngle) * 0.8;
      droneGroup.position.y = 1.3 + Math.sin(elapsedTime * 2.8) * 0.15;

      const droneRing = droneGroup.getObjectByName('droneRing');
      if (droneRing) {
        droneRing.rotation.x = elapsedTime * 3;
        droneRing.rotation.y = elapsedTime * 2;
      }
    }

    // 7. Dynamic Pose Engine
    applyPoseAnimations(elapsedTime);
  }

  function applyPoseAnimations(elapsedTime) {
    if (!leftArmGroup || !rightArmGroup) return;

    switch (currentPose) {
      case 'wave':
        // Left arm waves enthusiastically
        leftArmGroup.rotation.z = 2.0 + Math.sin(elapsedTime * 6) * 0.35;
        leftArmGroup.rotation.x = 0.2;
        leftArmGroup.rotation.y = 0.2;

        // Right arm relaxed
        rightArmGroup.rotation.z = -0.2 + Math.sin(elapsedTime * 2) * 0.05;
        rightArmGroup.rotation.x = 0.0;
        break;

      case 'present':
        // Both arms open wide presenting content
        leftArmGroup.rotation.z = 0.8 + Math.sin(elapsedTime * 2) * 0.08;
        leftArmGroup.rotation.x = 0.6;
        leftArmGroup.rotation.y = 0.3;

        rightArmGroup.rotation.z = -0.8 - Math.sin(elapsedTime * 2) * 0.08;
        rightArmGroup.rotation.x = 0.6;
        rightArmGroup.rotation.y = -0.3;
        break;

      case 'scan':
        // Left arm points towards skill cards with scanning laser oscillation
        leftArmGroup.rotation.z = 1.4 + Math.sin(elapsedTime * 3) * 0.15;
        leftArmGroup.rotation.x = 0.8;
        leftArmGroup.rotation.y = -0.4;

        rightArmGroup.rotation.z = -0.3;
        rightArmGroup.rotation.x = 0.2;
        break;

      case 'inspect':
        // Arms holding / inspecting holographic project
        leftArmGroup.rotation.z = 0.7;
        leftArmGroup.rotation.x = 0.9 + Math.sin(elapsedTime * 2) * 0.05;
        leftArmGroup.rotation.y = -0.4;

        rightArmGroup.rotation.z = -0.7;
        rightArmGroup.rotation.x = 0.9 + Math.sin(elapsedTime * 2) * 0.05;
        rightArmGroup.rotation.y = 0.4;
        break;

      case 'think':
        // Right hand on chin, left arm crossed
        rightArmGroup.rotation.z = -1.6;
        rightArmGroup.rotation.x = 1.0;
        rightArmGroup.rotation.y = 0.5;

        leftArmGroup.rotation.z = 0.8;
        leftArmGroup.rotation.x = 0.4;
        leftArmGroup.rotation.y = 0.2;
        break;

      case 'guide':
        // Left arm points along the timeline
        leftArmGroup.rotation.z = 1.2 + Math.sin(elapsedTime * 2) * 0.1;
        leftArmGroup.rotation.x = 0.5;
        leftArmGroup.rotation.y = 0.2;

        rightArmGroup.rotation.z = -0.2;
        rightArmGroup.rotation.x = 0.0;
        break;

      case 'cheer':
        // Both arms raised high celebrating & welcoming
        leftArmGroup.rotation.z = 2.4 + Math.sin(elapsedTime * 5) * 0.2;
        leftArmGroup.rotation.x = 0.2;

        rightArmGroup.rotation.z = -2.4 - Math.sin(elapsedTime * 5) * 0.2;
        rightArmGroup.rotation.x = 0.2;
        break;

      default:
        leftArmGroup.rotation.set(0, 0, 0.2);
        rightArmGroup.rotation.set(0, 0, -0.2);
        break;
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuide);
  } else {
    initGuide();
  }
})();
