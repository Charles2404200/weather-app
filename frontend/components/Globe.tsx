'use client';

import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { City, WORLD_CITIES } from '@/lib/cities';
import styles from './Globe.module.css';

interface GlobeProps {
  onCitySelect: (city: City) => void;
  selectedCity: City | null;
}

interface GlobeHandle {
  rotateTo: (city: City) => void;
}

const Globe = forwardRef<GlobeHandle, GlobeProps>(
  ({ onCitySelect, selectedCity }: GlobeProps, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredCity, setHoveredCity] = useState<City | null>(null);
    const earthRef = useRef<THREE.Mesh | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rotationTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isRotatingRef = useRef(false);
    const rotateToFunctionRef = useRef<(city: City) => void>(() => {});

    const memoizedOnCitySelect = useCallback(onCitySelect, [onCitySelect]);

    useEffect(() => {
      if (!containerRef.current) return;

      // Setup scene, camera, renderer
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#000814');

      const camera = new THREE.PerspectiveCamera(
        45,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        100
      );
      camera.position.z = 3;
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current.appendChild(renderer.domElement);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));

      // Sun position based on local time
      const getSunPosition = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalHours = hours + minutes / 60;
        const angle = (totalHours / 24) * Math.PI * 2;
        const distance = 5;

        return {
          x: Math.cos(angle) * distance,
          y: 2,
          z: Math.sin(angle) * distance,
          hours,
          totalHours,
        };
      };

      const { x: sunX, y: sunY, z: sunZ, hours: userHour } = getSunPosition();
      const sun = new THREE.DirectionalLight(0xffffff, 1.2);
      sun.position.set(sunX, sunY, sunZ);
      scene.add(sun);

      console.log(`🌍 Local time: ${userHour}:${new Date().getMinutes().toString().padStart(2, '0')}`);
      console.log(`☀️ Sun position: (${sunX.toFixed(2)}, ${sunY.toFixed(2)}, ${sunZ.toFixed(2)})`);

      // Load Earth textures
      const loader = new THREE.TextureLoader();
      const earth = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshPhongMaterial()
      );
      scene.add(earth);
      earthRef.current = earth;

      const dayMapPromise = new Promise<THREE.Texture>((resolve) => {
        loader.load('/textures/8k_earth_daymap.jpg', resolve, undefined, () => {
          console.warn('Day map not found, using fallback');
          resolve(new THREE.Texture(createFallbackCanvas()));
        });
      });

      const nightMapPromise = new Promise<THREE.Texture>((resolve) => {
        loader.load('/textures/8k_earth_nightmap.jpg', resolve, undefined, () => {
          console.warn('Night map not found, using fallback');
          resolve(new THREE.Texture(createFallbackCanvas(true)));
        });
      });

    Promise.all([dayMapPromise, nightMapPromise]).then(([dayMap, nightMap]) => {
      // Create a custom material that blends day and night maps
      const material = new THREE.ShaderMaterial({
        uniforms: {
          dayMap: { value: dayMap },
          nightMap: { value: nightMap },
          sunPosition: { value: sun.position },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          varying vec2 vUv;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D dayMap;
          uniform sampler2D nightMap;
          uniform vec3 sunPosition;
          
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          varying vec2 vUv;
          
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 sunDir = normalize(sunPosition);
            
            float daylight = dot(normal, sunDir);
            float blend = smoothstep(-0.3, 0.5, daylight);
            
            vec4 day = texture2D(dayMap, vUv);
            vec4 night = texture2D(nightMap, vUv);
            
            vec4 color = mix(night, day, blend);
            
            // Add some specular highlight during day
            float spec = pow(max(0.0, dot(normal, normalize(sunDir))), 32.0);
            color.rgb += spec * 0.3 * blend;
            
            gl_FragColor = color;
          }
        `,
      });

      earth.material = material;
    });

    // Clouds layer
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.01, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
        depthWrite: false,
      })
    );
    scene.add(clouds);

    // Atmosphere glow
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      })
    );
    scene.add(atmosphere);

    // City markers
    const cityGroup = new THREE.Group();
    earth.add(cityGroup);

    const cityMeshes: { mesh: THREE.Mesh; city: City }[] = [];

    const buildCityMarkers = (cities: City[]) => {
      console.log(`[buildCityMarkers] Called with ${cities.length} cities, clearing ${cityMeshes.length} old markers`);
      cityGroup.clear();
      cityMeshes.length = 0;

      cities.forEach((city) => {
        const phi = (90 - city.latitude) * (Math.PI / 180);
        const theta = (city.longitude + 180) * (Math.PI / 180);

        const radius = 1.025;
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        const cityMarkerGroup = new THREE.Group();
        cityMarkerGroup.position.set(x, y, z);
        const glowMarker = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 16, 16),
          new THREE.MeshPhongMaterial({
            color: 0xff6b6b,
            emissive: 0xff6b6b,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.4,
          })
        );
        glowMarker.position.set(0, 0, 0);
        cityMarkerGroup.add(glowMarker);

        // Main point marker (larger and brighter)
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.018, 16, 16),
          new THREE.MeshPhongMaterial({ 
            color: 0xff6b6b,
            emissive: 0xff3333,
            emissiveIntensity: 1.0,
          })
        );
        marker.position.set(0, 0, 0);
        cityMarkerGroup.add(marker);

        // Pin/spike pointing outward (larger)
        const pinGeometry = new THREE.ConeGeometry(0.012, 0.06, 16);
        const pinMaterial = new THREE.MeshPhongMaterial({
          color: 0xffaa00,
          emissive: 0xffaa00,
          emissiveIntensity: 0.8,
        });
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.position.set(0, 0.05, 0);
        const pinDir = new THREE.Vector3(x, y, z).normalize();
        pin.lookAt(pinDir);
        cityMarkerGroup.add(pin);

        // Rotate entire group to face outward
        cityMarkerGroup.lookAt(x * 2, y * 2, z * 2);

        cityGroup.add(cityMarkerGroup);
        cityMeshes.push({ mesh: marker, city });
      });
    };

    // Start with small built-in list so globe always has markers
    buildCityMarkers(WORLD_CITIES);

    // Connect to WebSocket for real-time city streaming
    const connectWebSocket = () => {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const wsUrl = apiBaseUrl.replace(/^https?/, (match) => (match === 'https' ? 'wss' : 'ws')) + '/geocoding/ws/cities';
      
      console.log(`[WebSocket] Connecting to: ${wsUrl}`);
      const ws = new WebSocket(wsUrl);
      let receivedCities: City[] = [...WORLD_CITIES];

      ws.onopen = () => {
        console.log('WebSocket connected for real-time cities');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'city') {
            const city = message.data as City;
            // Check if city already exists to avoid duplicates
            if (!receivedCities.some((c) => c.name === city.name && c.country === city.country)) {
              receivedCities.push(city);
            }
            
            // Update city markers in real-time
            buildCityMarkers(receivedCities);
            console.log(`Loaded city ${message.index + 1}/${message.total}: ${city.name}`);
          } else if (message.type === 'complete') {
            console.log(`✓ WebSocket complete: ${message.message}`);
            ws.close();
          } else if (message.type === 'error') {
            console.error('WebSocket error:', message.message);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.warn('WebSocket error, falling back to REST API', error);
        loadCitiesFromAPI();
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
    };
    connectWebSocket();
    const loadCitiesFromAPI = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/geocoding/major-cities`
        );
        if (response.ok) {
          const cities: City[] = await response.json();
          if (cities && cities.length > 0) {
            buildCityMarkers(cities);
            console.log(`Loaded ${cities.length} cities from REST API`);
          }
        }
      } catch (err) {
        console.warn('Failed to load cities from API, using fallback', err);
      }
    };

    // Keep JSON fallback as last resort
    fetch('/cities/world_cities.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: City[] | null) => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Only use JSON if we don't have API data yet
          if (cityMeshes.length === WORLD_CITIES.length) {
            buildCityMarkers(data);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load world_cities.json', err);
      });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle dragging rotation
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        earth.rotation.y += deltaX * 0.01;
        earth.rotation.x += deltaY * 0.01;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(
        cityMeshes.map((c) => c.mesh)
      );

      cityMeshes.forEach(({ mesh }) => {
        const mat = mesh.material as THREE.MeshPhongMaterial;
        mat.color.set(0xff6b6b);
        mat.emissive.set(0xff3333);
      });

      if (hits.length > 0) {
        const hit = cityMeshes.find((c) => c.mesh === hits[0].object);
        if (hit) {
          const mat = hit.mesh.material as THREE.MeshPhongMaterial;
          mat.color.set(0xffd700);
          mat.emissive.set(0xffff00);
          setHoveredCity(hit.city);
        }
      } else {
        setHoveredCity(null);
      }
    };

    const onClick = () => {
      console.log(`[onClick] cityMeshes.length before: ${cityMeshes.length}`);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(
        cityMeshes.map((c) => c.mesh)
      );
      console.log(`[onClick] raycaster hits: ${hits.length}`);
      if (hits.length > 0) {
        const hit = cityMeshes.find((c) => c.mesh === hits[0].object);
        if (hit) {
          console.log(`[onClick] Selected city: ${hit.city.name}, cityGroup children: ${cityGroup.children.length}`);
          memoizedOnCitySelect(hit.city);
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    containerRef.current.addEventListener('mousemove', onPointerMove);
    containerRef.current.addEventListener('click', onClick);
    containerRef.current.addEventListener('mousedown', onMouseDown);
    containerRef.current.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseup', onMouseUp);


    const animate = () => {
      if (isRotatingRef.current && earthRef.current) {
        const currentX = earthRef.current.rotation.x;
        const currentY = earthRef.current.rotation.y;
        const targetX = rotationTargetRef.current.x;
        const targetY = rotationTargetRef.current.y;

        const lerpFactor = 0.08;
        earthRef.current.rotation.x += (targetX - currentX) * lerpFactor;
        earthRef.current.rotation.y += (targetY - currentY) * lerpFactor;
        if (
          Math.abs(targetX - currentX) < 0.01 &&
          Math.abs(targetY - currentY) < 0.01
        ) {
          isRotatingRef.current = false;
          earthRef.current.rotation.x = targetX;
          earthRef.current.rotation.y = targetY;
        }
      } else if (!isDragging) {
        // Normal continuous rotation
        earth.rotation.y += 0.0005;
      }

      clouds.rotation.y += 0.0008;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      containerRef.current?.removeEventListener('mousemove', onPointerMove);
      containerRef.current?.removeEventListener('click', onClick);
      containerRef.current?.removeEventListener('mousedown', onMouseDown);
      containerRef.current?.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [memoizedOnCitySelect]);

    const rotateToCity = (city: City) => {
      const phi = (90 - city.latitude) * (Math.PI / 180);
      const theta = (city.longitude + 180) * (Math.PI / 180);
      rotationTargetRef.current = {
        x: Math.PI / 2 - phi,
        y: -theta,
      };

      isRotatingRef.current = true;
      console.log(`🌍 Rotating to ${city.name}...`);
    };

    rotateToFunctionRef.current = rotateToCity;
    useImperativeHandle(ref, () => ({
      rotateTo: (city: City) => {
        rotateToFunctionRef.current(city);
      }
    }), []);

    return (
      <div className={styles.container}>
        <div ref={containerRef} className={styles.globeContainer} />
        {hoveredCity && (
          <div className={styles.previewBox}>
            <div className={styles.previewHeader}>
              <h3 className={styles.cityName}>{hoveredCity.name}</h3>
              <span className={styles.flag}>🌍</span>
            </div>
            <div className={styles.previewContent}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Country:</span>
                <span className={styles.value}>{hoveredCity.country}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Latitude:</span>
                <span className={styles.value}>{hoveredCity.latitude.toFixed(4)}°</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Longitude:</span>
                <span className={styles.value}>{hoveredCity.longitude.toFixed(4)}°</span>
              </div>
            </div>
            <div className={styles.hint}>Click to view weather</div>
          </div>
        )}
        {selectedCity && (
          <div className={styles.selected}>✓ {selectedCity.name}</div>
        )}
      </div>
    );
  }
);

Globe.displayName = 'Globe';

export default Globe;

function createFallbackCanvas(isNight: boolean = false): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  if (isNight) {
    // Night fallback - dark blue with city lights
    ctx.fillStyle = '#000814';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffff99';
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillRect(x, y, 2, 2);
    }
  } else {
    ctx.fillStyle = '#1a72ba';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2d8659';
    ctx.fillRect(50, 50, 80, 80);
    ctx.fillRect(150, 100, 60, 70);
    ctx.fillRect(250, 40, 100, 100);
  }
  
  return canvas;
}
