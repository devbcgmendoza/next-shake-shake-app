import { useState, useEffect } from 'react';

interface AccelerationIncludingGravity {
  x: number;
  y: number;
  z: number;
}

interface DeviceMotionEvent extends Event {
  accelerationIncludingGravity: AccelerationIncludingGravity;
}

const useShakeDetector = () => {
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [shakeIntensity, setShakeIntensity] = useState<number>(0);

  useEffect(() => {
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;

      // Get acceleration values
      const x = accelerationIncludingGravity.x;
      const y = accelerationIncludingGravity.y;
      const z = accelerationIncludingGravity.z;

      // Calculate the acceleration magnitude
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      // Define thresholds
      const SHAKE_THRESHOLD = 15; // Adjust this value as needed

      // Check if the shake exceeds the threshold
      if (acceleration > SHAKE_THRESHOLD) {
        setIsShaking(true);
        setShakeIntensity(acceleration - SHAKE_THRESHOLD);
        // Optional: reset shaking status after a short delay
        setTimeout(() => {
          setIsShaking(false);
          setShakeIntensity(0);
        }, 1000); // Shake detected for 1 second
      } else {
        setIsShaking(false);
        setShakeIntensity(0);
      }
    };

    // Add event listener
    window.addEventListener('devicemotion', handleDeviceMotion as EventListener);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion as EventListener);
    };
  }, []);

  return { isShaking, shakeIntensity };
};

export default useShakeDetector;
