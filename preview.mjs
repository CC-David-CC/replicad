import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// One renderer belongs to one desktop window. Render on changes, not in an
// animation loop, so an idle model does not keep consuming GPU time.
export function makePreview(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0xeaf0f5);
  renderer.domElement.setAttribute('aria-label', '3D model preview');
  container.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x536475, 2));
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(2, 3, 5); scene.add(light);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 1000000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  let mesh = null, disposed = false;
  const render = () => { if (!disposed) renderer.render(scene, camera); };
  controls.addEventListener('change', render);
  const resize = () => {
    const width = container.clientWidth, height = container.clientHeight;
    if (!width || !height || disposed) return;
    renderer.setSize(width, height, false); camera.aspect = width / height;
    camera.updateProjectionMatrix(); render();
  };
  const observer = new ResizeObserver(resize); observer.observe(container);
  function show(bytes) {
    const geometry = new STLLoader().parse(bytes);
    geometry.computeVertexNormals(); geometry.computeBoundingBox();
    const bounds = geometry.boundingBox, center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3()), radius = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(radius) || radius <= 0) { geometry.dispose(); throw Error('Model has no visible geometry.'); }
    const next = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x2879a8, roughness: 0.65, metalness: 0.08 }));
    if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); }
    mesh = next; scene.add(mesh); controls.target.copy(center);
    camera.near = radius / 1000; camera.far = radius * 100;
    camera.position.copy(center).add(new THREE.Vector3(1.5, 1.2, 1.8).normalize().multiplyScalar(radius * 2.5));
    camera.updateProjectionMatrix(); controls.update(); resize();
  }
  resize();
  return { show, dispose() { disposed = true; observer.disconnect(); controls.dispose(); if (mesh) { mesh.geometry.dispose(); mesh.material.dispose(); } renderer.dispose(); renderer.domElement.remove(); } };
}
