/**
 * ============================================================================
 * THREE-SCENE.JS - 3D WebGL Canvas & Environment Setup
 * ============================================================================
 */

(function () {
  'use strict';

  // Global namespace for Three.js application
  window.ThreeApp = window.ThreeApp || {};

  const App = window.ThreeApp;
  const canvas = document.getElementById('webgl-canvas');

  // Scene globals
  let scene, camera, renderer;
  let particleSystem, gridParticles;
  let pointLightCyan, pointLightPurple, ambientLight, dirLight;
  let width = window.innerWidth;
  let height = window.innerHeight;

  // Mouse & Parallax tracking
  App.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  App.clock = new THREE.Clock();

  function init() {
    // 1. Create Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080d, 0.035);
    App.scene = scene;

    // 2. Setup Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);
    App.camera = camera;

    // 3. Setup WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    App.renderer = renderer;

    // 4. Setup Lighting
    setupLights();

    // 5. Setup Floating Particles & Cyber Atmosphere
    setupParticles();

    // 6. Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // 7. Start Animation Loop
    animate();
  }

  function setupLights() {
    // Soft Ambient Light
    ambientLight = new THREE.AmbientLight(0x1a2436, 1.8);
    scene.add(ambientLight);

    // Directional Key Light
    dirLight = new THREE.DirectionalLight(0xd4f4ff, 2.2);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // Cyan Neon Accent Light
    pointLightCyan = new THREE.PointLight(0x00f0ff, 3.5, 25);
    pointLightCyan.position.set(3, 2, 4);
    scene.add(pointLightCyan);
    App.pointLightCyan = pointLightCyan;

    // Purple Rim Light
    pointLightPurple = new THREE.PointLight(0x9d4edd, 4.0, 25);
    pointLightPurple.position.set(-4, -2, 2);
    scene.add(pointLightPurple);
    App.pointLightPurple = pointLightPurple;
  }

  function setupParticles() {
    // Cyber Dust / Starfield Particles
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyan = new THREE.Color(0x00f0ff);
    const purple = new THREE.Color(0x8c52ff);
    const emerald = new THREE.Color(0x00f59b);
    const white = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      // Position spread
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

      // Random color assignment
      const rand = Math.random();
      let color;
      if (rand < 0.45) color = cyan;
      else if (rand < 0.75) color = purple;
      else if (rand < 0.90) color = emerald;
      else color = white;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width / height;
    
    // Adjust camera distance for smaller mobile screens
    if (width < 768) {
      camera.fov = 55;
      camera.position.z = 12;
    } else {
      camera.fov = 45;
      camera.position.z = 10;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onMouseMove(event) {
    App.mouse.targetX = (event.clientX / width) * 2 - 1;
    App.mouse.targetY = -(event.clientY / height) * 2 + 1;
  }

  function onTouchMove(event) {
    if (event.touches.length > 0) {
      App.mouse.targetX = (event.touches[0].clientX / width) * 2 - 1;
      App.mouse.targetY = -(event.touches[0].clientY / height) * 2 + 1;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    const delta = App.clock.getDelta();
    const elapsedTime = App.clock.getElapsedTime();

    // Smooth Mouse Easing
    App.mouse.x += (App.mouse.targetX - App.mouse.x) * 0.06;
    App.mouse.y += (App.mouse.targetY - App.mouse.y) * 0.06;

    // Subtle Particle Wave Animation
    if (particleSystem) {
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = App.mouse.y * 0.05;
      particleSystem.position.x = App.mouse.x * 0.5;
    }

    // Dynamic light movement
    if (pointLightCyan) {
      pointLightCyan.position.x = 3 + Math.sin(elapsedTime * 0.8) * 1.5 + App.mouse.x * 2;
      pointLightCyan.position.y = 2 + Math.cos(elapsedTime * 0.7) * 1.2 + App.mouse.y * 2;
    }

    // Call update on Student Guide if registered
    if (App.StudentGuide && typeof App.StudentGuide.update === 'function') {
      App.StudentGuide.update(elapsedTime, delta);
    }

    // Render Scene
    renderer.render(scene, camera);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
