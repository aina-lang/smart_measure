import { useState, useEffect } from 'react';
import { DeviceMotion } from 'expo-sensors';

export type OrientationData = {
  pitch: number; // Radian (Inclinaison devant/derrière)
  roll: number;  // Radian (Inclinaison gauche/droite)
  yaw: number;   // Radian (Rotation)
};

export const useCameraSensors = () => {
  const [orientation, setOrientation] = useState<OrientationData>({
    pitch: 0,
    roll: 0,
    yaw: 0,
  });

  useEffect(() => {
    let subscription: any;

    const subscribe = async () => {
      const isAvailable = await DeviceMotion.isAvailableAsync();
      if (!isAvailable) return;

      subscription = DeviceMotion.addListener((motionData) => {
        if (motionData.rotation) {
          setOrientation({
            pitch: motionData.rotation.beta,
            roll: motionData.rotation.gamma,
            yaw: motionData.rotation.alpha,
          });
        }
      });

      DeviceMotion.setUpdateInterval(50); // 20fps pour une fluidité décente
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return orientation;
};
