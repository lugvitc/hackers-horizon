console.clear();
// Not to be change anything
import * as THREE from "https://cdn.skypack.dev/three@0.131.3";

// create controls for the camera in the animation.
import { OrbitControls } from "https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js";

// used to create Perlin noise for the animation.
import { ImprovedNoise } from "https://cdn.skypack.dev/three@0.131.3/examples/jsm/math/ImprovedNoise.js";

const perlin = new ImprovedNoise();

//Size of the canvas
var container = document.getElementById("canvas");
document.body.appendChild(container);

// console.log(container)
var w = container.offsetWidth;
var h = container.offsetHeight;
// console.log(h)

let backColor = 0xff7fbb;
let scene = new THREE.Scene();
scene.fog = new THREE.Fog(backColor, 149.5, 150);
let renderer = new THREE.WebGLRenderer({ antialias: true });

let camera = new THREE.PerspectiveCamera(45, w / h, 1, 2500);
camera.position.set(0, 5, 100);

//renderer.setClearColor(backColor);
//  The renderer is what will display the animation on the screen.
renderer.setSize(w, h);
container.appendChild(renderer.domElement);

// // Creating a new instance of OrbitControls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.target.set(0, 5, 0); //// Setting the target position of the orbit controls
controls.maxDistance = 200; // Setting the maximum distance of the orbit controls
controls.minPolarAngle = Math.PI * 0.5; // Setting the minimum and maximum polar angle of the orbit
controls.maxPolarAngle = Math.PI * 0.5;
controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = 0;
controls.update();

let light = new THREE.DirectionalLight(0xff99dd, 0.5); //Creating a new directional light (sun)
light.position.set(0, 35, -250); // Setting the position of the light
scene.add(light, new THREE.AmbientLight(0xffffff, 1.5)); // Adding the light and a new ambient light to the scene

let globalUniforms = {
  time: { value: 0 }
};

let g = new THREE.PlaneGeometry(200, 500, 50, 125); // Creating a new plane geometry
g.rotateX(Math.PI * -0.5); // Rotating the geometry
let sc = new THREE.Vector2(10, 25);

let pos = g.attributes.position; // Assigning the position attribute for the geometry
let uv = g.attributes.uv;
let vUv = new THREE.Vector2();

let m = new THREE.MeshStandardMaterial({
  color: 0x00007f,
  wireframe: false, //Setting attributes
  roughness: 0.6,
  metalness: 0.5,
  onBeforeCompile: (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <fog_fragment>`,
      `
        vec2 coord = vUv * vec2(50., 125.);
        vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) / 1.5;
        float line = min(grid.x, grid.y);
        line = min(line, 1.0);
        vec3 col = mix(vec3(0.5, 1, 1), gl_FragColor.rgb, line);
        gl_FragColor = vec4( col, opacity);
        
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            float fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
          #else
            float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
          #endif
          if (fogDepth > fogFar + 50.) discard;
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
        #endif
      `
    );
  }
});
m.defines = { USE_UV: "" };
m.extensions = { derivatives: true };
let o = new THREE.Mesh(g, m);
scene.add(o);

//This will be the sun
let sg = new THREE.CircleGeometry(50, 64);
let sm = new THREE.MeshBasicMaterial({
  color: 0xffeeff,
  fog: false,
  transparent: true,
  onBeforeCompile: (shader) => {
    shader.uniforms.time = globalUniforms.time;
    shader.fragmentShader = `
      uniform float time;
      ${shader.fragmentShader}`.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
        vec2 uv = vUv - 0.5;
        float f = smoothstep(0.5, 0.475, length(uv));
        
        // stripes
        vec2 sUv = uv;
        sUv.y *= 100.;
        float sf = (sin(sUv.y - (time * 2.)) * 0.5 + 0.5);
        float wave = (uv.y + 0.5) * 2.;
        float e = length(fwidth(sUv));
        sf = 1. - smoothstep(wave - e, wave, sf);
        //
        vec3 col = mix(diffuse * vec3(1, 0.75, 0.875), diffuse, clamp(vUv.y * 4., 0., 1.));
        vec4 diffuseColor = vec4( col, pow(f, 3.) * sf );
      `
    );
    //console.log(shader.fragmentShader);
  }
});
sm.defines = { USE_UV: "" };
sm.extensions = { derivatives: true };
let so = new THREE.Mesh(sg, sm);

scene.add(so);

// dots
let ig = new THREE.InstancedBufferGeometry().copy(
  new THREE.SphereGeometry(0.2, 8, 6)
);
ig.instanceCount = Infinity;
ig.setAttribute(
  "instPos",
  new THREE.InstancedBufferAttribute(g.attributes.position.array, 3)
);
let im = new THREE.MeshBasicMaterial({
  color: 0xffccaa,
  onBeforeCompile: (shader) => {
    shader.vertexShader = `
      attribute vec3 instPos;
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
        transformed += instPos;
      `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <fog_fragment>`,
      `#ifdef USE_FOG
          #ifdef FOG_EXP2
            float fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
          #else
            float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
          #endif
          if (fogDepth > fogFar) discard;
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
        #endif`
    );
    //console.log(shader.vertexShader);
  }
});
let io = new THREE.Mesh(ig, im);
io.frustumCulled = false;
scene.add(io);

function setTerrain(t) {
  for (let i = 0; i < pos.count; i++) {
    vUv.fromBufferAttribute(uv, i);
    let s = smoothstep(0.01, 0.125, Math.abs(vUv.x - 0.5));
    vUv.multiply(sc);
    let y = perlin.noise(vUv.x, vUv.y + 1, 0.005 + t) * 0.5 + 0.5;
    pos.setY(i, Math.pow(y, 5) * 75 * s);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  ig.attributes.instPos.needsUpdate = true;
}

setTerrain(0);

// background

let bg = new THREE.SphereGeometry(2000, 64, 32);
let bm = new THREE.MeshBasicMaterial({
  fog: false,
  side: THREE.BackSide,
  onBeforeCompile: (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
        vec2 uv = vUv;
        vec3 c1 = vec3(1., 0.5, 0.5);
        vec3 c2 = vec3(0, 0, 0.5);
        float f = smoothstep(0.5, 0.575, uv.y);
        vec3 col = mix(c1, c2, f);
      vec4 diffuseColor = vec4( col, opacity );`
    );
    console.log(shader.fragmentShader);
  }
});
bm.defines = { USE_UV: "" };
let bo = new THREE.Mesh(bg, bm);
scene.add(bo);

window.addEventListener("resize", onWindowResize);

let clock = new THREE.Clock();
renderer.setAnimationLoop((_) => {
  let t = clock.getElapsedTime();
  globalUniforms.time.value = t;
  setTerrain(t * 0.075);
  so.position.copy(camera.position).setY(20).z -= 500;
  renderer.render(scene, camera);
});

//https://github.com/gre/smoothstep/blob/master/index.js
function smoothstep(min, max, value) {
  var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}
