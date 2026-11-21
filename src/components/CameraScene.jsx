import { Suspense, useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    useGLTF,
    Center,
    Environment,
    Resize,
    useTexture,
} from '@react-three/drei';

import * as THREE from 'three';
import '../styles/CameraScene.css';

const heroImageURL =
    'https://res.cloudinary.com/ilxxkwra/image/upload/f_auto,q_auto:best,w_2560/v1795249182/hero_image.webp';

function CameraModel({ animation }) {

    const { scene } = useGLTF('/models/camera-final.glb');

    const modelRef = useRef(null);

    const heroTexture = useTexture(heroImageURL);

    const { invalidate, gl } = useThree();

    // ========================================
    // HIGH-RESOLUTION LCD TEXTURE
    // ========================================

    useLayoutEffect(() => {

        const screen = scene.getObjectByName('Screen');

        if (!screen) {
            console.error('Rear screen mesh not found');
            return;
        }

        const originalMaterial = screen.material;
        const originalTexture = originalMaterial.map;

        const texture = heroTexture.clone();

        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        texture.anisotropy = Math.min(
            8,
            gl.capabilities.getMaxAnisotropy()
        );

        // Preserve the original texture mapping

        if (originalTexture) {

            texture.offset.copy(originalTexture.offset);
            texture.repeat.copy(originalTexture.repeat);
            texture.rotation = originalTexture.rotation;
            texture.center.copy(originalTexture.center);
            texture.channel = originalTexture.channel;

        }

        // Prevent unwanted texture repetition

        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        texture.needsUpdate = true;

        // Display the photograph without reflections

        const screenMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            color: 0xffffff,
            toneMapped: false,
            side: originalMaterial.side
        });

        screen.material = screenMaterial;

        invalidate();

        return () => {

            screen.material = originalMaterial;

            screenMaterial.dispose();
            texture.dispose();

        };

    }, [scene, heroTexture, gl, invalidate]);

    // ========================================
    // CAMERA DOLLY-OUT AND ROTATION
    // ========================================

    useFrame(({ camera, size }) => {

        if (!modelRef.current) return;

        const progress = animation.current.zoom ?? 0;

        const lcdX = -0.3167;
        const lcdY = -0.1732;
        const lcdZ = 1.1395;

        const lcdWidth = 0.9543;
        const lcdHeight = 0.7052;

        const aspect = size.width / size.height;

        const fov = THREE.MathUtils.degToRad(camera.fov);
        const tangent = Math.tan(fov / 2);

        const distance = Math.min(
            lcdHeight / (2 * tangent),
            lcdWidth / (2 * tangent * aspect)
        ) * 0.95;

        camera.position.set(

            THREE.MathUtils.lerp(lcdX, 0, progress),

            THREE.MathUtils.lerp(lcdY, 0, progress),

            THREE.MathUtils.lerp(
                lcdZ + distance,
                5,
                progress
            )

        );

        camera.lookAt(

            THREE.MathUtils.lerp(lcdX, 0, progress),

            THREE.MathUtils.lerp(lcdY, 0, progress),

            0

        );

        modelRef.current.rotation.y =
            animation.current.rotation ?? 0;

    });

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
                    far: 100
                }}

                dpr={1}

                frameloop="demand"

                gl={{
                    antialias: true
                }}

                onCreated={({ invalidate }) => {

                    invalidateRef.current = invalidate;

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

useGLTF.preload('/models/camera-final.glb');
useTexture.preload(heroImageURL);

export default CameraScene;