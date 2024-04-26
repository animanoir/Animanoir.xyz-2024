import * as THREE from "three";
import React, { Suspense } from "react";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { shaderMaterial, OrbitControls } from "@react-three/drei";
import glsl from "glslify";
import oscarImg from "@/images/about/oscar-a-montiel-animanoir-geosmina.jpg";
import { EffectComposer, Glitch } from "@react-three/postprocessing";

const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;
    varying float vWave;

    uniform float uTime;

    // Helper Functions----------------------

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
      return mod289(((x * 34.0) + 1.0) * x);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    // Noise function
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy; // -1.0+3.0*C.x = -0.5 = -D.y

      i = mod289(i);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float noiseFreq = 10.1;
      float noiseAmp = 0.4;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise(noisePos) * noiseAmp;
      vWave = pos.z;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      float wave = vWave * 0.2;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      // gl_FragColor = vec4(0.8,0.4,0.2,1.0); //Says how to color inside the vertex of the geometry.
      gl_FragColor = vec4(texture, 1.0);
    }
  `
);

// When using extend it makes it available as a JSX element, "extending" non-built Three.js objects.
// extend({ WaveShaderMaterial });

const AboutImage = () => {
  // const { pointer } = useThree();

  // Using the useRef() function lets me access a Three.js object in the DOM directly.
  const [image] = useLoader(THREE.TextureLoader, [oscarImg.src]);
  // const materialRef = useRef();

  // useFrame(
  //   ({ clock }) =>
  //     (materialRef.current.uniforms.uTime.value = clock.getElapsedTime())
  // );

  //useFrame(({ clock }) => (image.offset.y = clock.getElapsedTime() / 10));

  // <waveShaderMaterial uColor={"white"} uTexture={image} ref={materialRef} />
  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={[1, 1.4, 1]}
      material-side={THREE.DoubleSide}
    >
      <planeGeometry attach="geometry" args={[1.0, 1.0, 1.0, 1.0]} />
      <meshBasicMaterial attach="material" map={image} />
    </mesh>
  );
};

const AboutImageScene = () => {
  // Function that executes when the scene is created.
  const sceneCreated = ({ gl }) => {
    gl.setClearColor("#060606", 1);
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1;
  };

  console.log("Se creó el Canvas.");

  return (
    <Canvas
      style={{ height: "100%", width: "100%" }}
      onCreated={sceneCreated}
      camera={{ fov: 60, position: [0, 0, 1.5] }}
    >
      <AboutImage />
      <hemisphereLight color="white" intensity={0.8} />
      <OrbitControls
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        enableZoom={false}
      />
      <EffectComposer>
        <Glitch
          ratio={0.5}
          strength={[0.01, 0.05]}
          delay={[1.0, 2.0]}
          duration={[0.4, 0.6]}
          chromaticAberrationOffset={(5.0, 0.2)}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default AboutImageScene;
