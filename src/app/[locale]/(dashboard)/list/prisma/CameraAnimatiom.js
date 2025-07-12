import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useEffect, useState } from "react";
import gsap from "gsap";

const CameraAnimation = () => {
    const scroll = useScroll();
    const { camera } = useThree();
    const [activeSection, setActiveSection] = useState(1);

    // Define the spline curve
    const points = [
        new Vector3(3.6, 1.4, -3.9),
        new Vector3(0.1, 1.4, -3.9),
        new Vector3(-5.1, 2.1, 0.0),
        new Vector3(-1.4, 1.4, 2.1),
        new Vector3(3.0, 0.8, 2.9),
        new Vector3(5.1, 1.9, -0.1),
    ];

    const totalSections = points.length;

    useFrame(() => {
        let currentPosition = scroll.offset * (totalSections - 1);

        // Determine the active section based on the scroll position
        const sectionIndex = Math.floor(currentPosition);
        if (sectionIndex !== activeSection - 1) {
            setActiveSection(sectionIndex + 1);
            const nextPoint = points[sectionIndex];

            // Animate camera position along the spline curve
            gsap.to(camera.position, {
                x: nextPoint.x,
                y: nextPoint.y,
                z: nextPoint.z,
                duration: 1.5,
                ease: 'power2.inOut',
                onUpdate: () => {
                    camera.lookAt(0, 1, 0); // Adjust the target to keep the camera focused
                },
            });
        }
    });

    return null;
};

export default CameraAnimation;
