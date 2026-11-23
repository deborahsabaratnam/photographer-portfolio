
import {
    Suspense,
    useRef,
    useLayoutEffect,
} from 'react';

import {
    Canvas,
    useFrame,
    useThree,
} from '@react-three/fiber';

import {
    useGLTF,
    useTexture,
    Center,
    Environment,
    Resize,
} from '@react-three/drei';

import * as THREE from 'three';
import '../styles/CameraScene.css';

// ========================================
// CONFIGURATION
// ========================================

const MODEL_URL = '/models/sony-camera-updated.glb';

const HERO_IMAGE_URL =
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795255647/IMG_3576_tiqqa5.jpg';

const HERO_COVER_FACTOR = 0.94;
const REVEAL_DISTANCE = 4.1;
const REVEAL_HEIGHT = 2.5;

const FINAL_ROTATION_Y = THREE.MathUtils.degToRad(110);
const FINAL_ROTATION_X = THREE.MathUtils.degToRad(-5);

// ========================================
// REUSABLE VECTORS
// ========================================

const origin = new THREE.Vector3(0, 0, 0);
const worldCenter = new THREE.Vector3();
const leftPoint = new THREE.Vector3();
const rightPoint = new THREE.Vector3();
const bottomPoint = new THREE.Vector3();
const topPoint = new THREE.Vector3();
const lcdNormal = new THREE.Vector3();
const heroPosition = new THREE.Vector3();
const revealPosition = new THREE.Vector3(
    0,
    REVEAL_HEIGHT,
    REVEAL_DISTANCE
);
const cameraTarget = new THREE.Vector3();
const localCenter = new THREE.Vector3();

// ========================================
// CAMERA MATERIAL COLOR CORRECTION
// ========================================

// This shader modification desaturates the
// camera's colored textures while preserving
// lighting, roughness, and metallic reflections.
//
// The LCD photograph is excluded.

function desaturateCameraMaterial(material) {
    if (!material || !material.isMeshStandardMaterial) {
        return;
    }

    const originalCompile = material.onBeforeCompile;

    material.onBeforeCompile = (shader, renderer) => {
        originalCompile.call(material, shader, renderer);

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <color_fragment>',
            `
            #include <color_fragment>

            // Convert surface color to grayscale.
            float grayscale = dot(
                diffuseColor.rgb,
                vec3(0.2126, 0.7152, 0.0722)
            );

            diffuseColor.rgb = vec3(grayscale);
            `
        );
    };

    material.customProgramCacheKey = () =>
        'pradagraph-monochrome-v1';

    material.needsUpdate = true;
}

// ========================================
// SONY CAMERA MODEL
// ========================================

function CameraModel({ animation }) {
    const { scene } = useGLTF(MODEL_URL);
    const heroTexture = useTexture(HERO_IMAGE_URL);

    const modelRef = useRef(null);
    const lcdRef = useRef(null);

    const { camera, gl } = useThree();

    // ========================================
    // CAMERA MATERIAL SETUP
    // ========================================

    useLayoutEffect(() => {
        const modifiedMaterials = new Set();
        const originalMaterials = new Map();

        scene.traverse((object) => {
            if (!object.isMesh) return;

            // Never modify the LCD photograph.
            if (object.name === 'sony_LCD') return;

            const materials = Array.isArray(object.material)
                ? object.material
                : [object.material];

            const replacements = materials.map((material) => {
                if (!material || !material.isMeshStandardMaterial) {
                    return material;
                }

                const clonedMaterial = material.clone();

                desaturateCameraMaterial(clonedMaterial);

                modifiedMaterials.add(clonedMaterial);

                return clonedMaterial;
            });

            originalMaterials.set(object, object.material);

            object.material = Array.isArray(object.material)
                ? replacements
                : replacements[0];
        });

        return () => {
            originalMaterials.forEach((material, object) => {
                object.material = material;
            });

            modifiedMaterials.forEach((material) => {
                material.dispose();
            });
        };
    }, [scene]);

    // ========================================
    // APPLY PHOTOGRAPH TO LCD
    // ========================================

    useLayoutEffect(() => {
        const lcd = scene.getObjectByName('sony_LCD');

        if (!lcd || !lcd.isMesh) {
            console.error('sony_LCD mesh not found');
            return;
        }

        lcdRef.current = lcd;

        const originalGeometry = lcd.geometry;
        const originalMaterial = lcd.material;

        const newGeometry = originalGeometry.clone();
        newGeometry.computeBoundingBox();

        const box = newGeometry.boundingBox;
        const positions = newGeometry.attributes.position;

        const width = box.max.x - box.min.x;
        const height = box.max.y - box.min.y;

        if (width <= 0 || height <= 0) {
            console.error('Invalid LCD dimensions');

            newGeometry.dispose();
            lcdRef.current = null;
            return;
        }

        // ========================================
        // LCD UV COORDINATES
        // ========================================

        const uvArray = new Float32Array(
            positions.count * 2
        );

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);

            const u = 1 - (x - box.min.x) / width;
            const v = 1 - (y - box.min.y) / height;

            uvArray[i * 2] = u;
            uvArray[i * 2 + 1] = v;
        }

        newGeometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(uvArray, 2)
        );

        lcd.geometry = newGeometry;

        // ========================================
        // LCD TEXTURE
        // ========================================

        const lcdTexture = heroTexture.clone();

        lcdTexture.flipY = false;
        lcdTexture.colorSpace = THREE.SRGBColorSpace;

        lcdTexture.minFilter =
            THREE.LinearMipmapLinearFilter;

        lcdTexture.magFilter = THREE.LinearFilter;
        lcdTexture.generateMipmaps = true;

        lcdTexture.anisotropy = Math.min(
            16,
            gl.capabilities.getMaxAnisotropy()
        );

        // ========================================
        // IMAGE COVER FIT
        // ========================================

        const screenAspect = width / height;

        const imageWidth = lcdTexture.image.width;
        const imageHeight = lcdTexture.image.height;
        const imageAspect = imageWidth / imageHeight;

        let repeatX = 1;
        let repeatY = 1;

        if (imageAspect > screenAspect) {
            repeatX = screenAspect / imageAspect;
        } else {
            repeatY = imageAspect / screenAspect;
        }

        lcdTexture.repeat.set(repeatX, repeatY);

        lcdTexture.offset.set(
            (1 - repeatX) / 2,
            (1 - repeatY) / 2
        );

        lcdTexture.wrapS = THREE.ClampToEdgeWrapping;
        lcdTexture.wrapT = THREE.ClampToEdgeWrapping;
        lcdTexture.needsUpdate = true;

        // ========================================
        // LCD MATERIAL
        // ========================================

        const photoMaterial = new THREE.MeshBasicMaterial({
            map: lcdTexture,
            color: 0xffffff,
            toneMapped: false,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2,
        });

        lcd.material = photoMaterial;

        console.log('Sony LCD photograph configured');

        return () => {
            lcdRef.current = null;

            lcd.geometry = originalGeometry;
            lcd.material = originalMaterial;

            newGeometry.dispose();
            photoMaterial.dispose();
            lcdTexture.dispose();
        };
    }, [scene, heroTexture, gl]);

    // ========================================
    // SCROLL ANIMATION
    // ========================================

    useFrame(({ size }) => {
        const model = modelRef.current;
        const lcd = lcdRef.current;

        if (!model || !lcd) return;

        const zoomProgress = THREE.MathUtils.clamp(
            animation.current.zoom ?? 0,
            0,
            1
        );

        const rotationProgress = THREE.MathUtils.clamp(
            (animation.current.rotation ?? 0) /
            THREE.MathUtils.degToRad(120),
            0,
            1
        );

        // ========================================
        // MEASURE LCD BEFORE ROTATION
        // ========================================

        model.rotation.set(0, 0, 0);
        model.updateWorldMatrix(true, true);

        const geometry = lcd.geometry;
        const box = geometry.boundingBox;

        if (!box) return;

        box.getCenter(localCenter);

        worldCenter.copy(localCenter);
        lcd.localToWorld(worldCenter);

        leftPoint.set(
            box.min.x,
            localCenter.y,
            localCenter.z
        );

        rightPoint.set(
            box.max.x,
            localCenter.y,
            localCenter.z
        );

        bottomPoint.set(
            localCenter.x,
            box.min.y,
            localCenter.z
        );

        topPoint.set(
            localCenter.x,
            box.max.y,
            localCenter.z
        );

        lcd.localToWorld(leftPoint);
        lcd.localToWorld(rightPoint);
        lcd.localToWorld(bottomPoint);
        lcd.localToWorld(topPoint);

        const worldWidth =
            leftPoint.distanceTo(rightPoint);

        const worldHeight =
            bottomPoint.distanceTo(topPoint);

        // ========================================
        // INITIAL HERO POSITION
        // ========================================

        const aspect = size.width / size.height;

        const tangent = Math.tan(
            THREE.MathUtils.degToRad(camera.fov) / 2
        );

        const distanceForHeight =
            worldHeight / (2 * tangent);

        const distanceForWidth =
            worldWidth / (2 * tangent * aspect);

        const heroDistance =
            Math.min(distanceForHeight, distanceForWidth) *
            HERO_COVER_FACTOR;

        lcdNormal
            .set(0, 0, 1)
            .transformDirection(lcd.matrixWorld);

        heroPosition
            .copy(worldCenter)
            .addScaledVector(lcdNormal, -heroDistance);

        // ========================================
        // CAMERA ZOOM-OUT
        // ========================================

        revealPosition.set(
            0,
            REVEAL_HEIGHT,
            REVEAL_DISTANCE
        );

        camera.position.lerpVectors(
            heroPosition,
            revealPosition,
            zoomProgress
        );

        cameraTarget.lerpVectors(
            worldCenter,
            origin,
            zoomProgress
        );

        camera.lookAt(cameraTarget);

        // ========================================
        // CAMERA ROTATION
        // ========================================

        model.rotation.y =
            FINAL_ROTATION_Y * rotationProgress;

        model.rotation.x =
            FINAL_ROTATION_X * rotationProgress;
    });

    // ========================================
    // RENDER CAMERA
    // ========================================

    return (
        <group ref={modelRef}>
            <Center>
                <Resize scale={2.5}>
                    <primitive
                        object={scene}
                        rotation={[0, Math.PI, 0]}
                    />
                </Resize>
            </Center>
        </group>
    );
}

// ========================================
// MAIN CAMERA SCENE
// ========================================

function CameraScene({ animation, invalidateRef }) {
    return (
        <div className="camera-scene">
            <Canvas
                camera={{
                    position: [0, 0, 5],
                    fov: 35,
                    near: 0.01,
                    far: 100,
                }}
                dpr={[1, 2]}
                frameloop="always"
                gl={{
                    antialias: true,
                    alpha: true,
                }}
                onCreated={({ invalidate }) => {
                    if (invalidateRef) {
                        invalidateRef.current = invalidate;
                    }
                }}
            >
                <ambientLight intensity={0.6} />

                <directionalLight
                    position={[5, 5, 5]}
                    intensity={2}
                />

                <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <CameraModel animation={animation} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// ========================================
// PRELOAD MODEL
// ========================================

useGLTF.preload(MODEL_URL);

export default CameraScene;
