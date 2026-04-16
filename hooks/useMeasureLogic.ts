import { useMemo } from 'react';
import { OrientationData } from './useCameraSensors';

export type Point = {
  id: string;
  name?: string;
  pitch: number;
  yaw: number;
  distance: number; // Distance du téléphone au point (hypoténuse)
  x: number; // Coordonnées 3D relatives
  y: number;
  z: number;
};

export type Unit = 'cm' | 'm' | 'in';

export const useMeasureLogic = (orientation: OrientationData, cameraHeight: number = 1.6) => {
  
  // Calcule la distance au sol (point d'impact du viseur au sol)
  // On utilise la hauteur de la caméra (h) et l'angle d'inclinaison (pitch)
  const currentGroundDistance = useMemo(() => {
    // Si pitch > 0, on regarde vers le bas (dans Expo DeviceMotion, 0 = vertical, PI/2 = à plat vers le bas)
    // Mais selon l'orientation tenue, ça peut varier. On va assumer :
    // pitch PI/2 (90°) = regarde l'horizon
    // pitch 0 = regarde le sol прямо sous soi ? Non, dépend de l'API.
    
    // Pour DeviceMotion : 0 = vertical vers le haut, PI = vertical vers le bas.
    // PI/2 = horizontal.
    
    const angleFromHorizontal = orientation.pitch - Math.PI / 2;
    
    if (angleFromHorizontal <= 0.05) return null; // Regarde l'horizon ou au dessus
    
    // d = h / tan(angleFromHorizontal)
    const distanceToFloor = cameraHeight / Math.tan(angleFromHorizontal);
    return Math.max(0, distanceToFloor);
  }, [orientation.pitch, cameraHeight]);

  const convertValue = (meters: number, unit: Unit) => {
    switch (unit) {
      case 'cm': return meters * 100;
      case 'in': return meters * 39.3701;
      case 'm': return meters;
      default: return meters;
    }
  };

  const formatValue = (meters: number, unit: Unit) => {
    const val = convertValue(meters, unit);
    return `${val.toFixed(unit === 'm' ? 2 : 1)}${unit}`;
  };

  // Calcul de la distance entre deux points 3D
  const calculateDistanceBetweenPoints = (p1: Point, p2: Point) => {
    return Math.sqrt(
      Math.pow(p2.x - p1.x, 2) + 
      Math.pow(p2.y - p1.y, 2) + 
      Math.pow(p2.z - p1.z, 2)
    );
  };

  const getPointFromCurrentOrientation = (id: string): Point | null => {
    const angleFromHorizontal = orientation.pitch - Math.PI / 2;
    if (angleFromHorizontal <= 0) return null;

    const groundDistance = cameraHeight / Math.tan(angleFromHorizontal);
    const hypotenuse = cameraHeight / Math.sin(angleFromHorizontal);

    // Conversion en coordonnées cartésiennes 3D relatives
    // x = horiz (yaw), y = vert (pitch), z = profondeur
    const x = groundDistance * Math.sin(orientation.yaw);
    const z = groundDistance * Math.cos(orientation.yaw);
    const y = -cameraHeight; // Niveau du sol

    return {
      id,
      pitch: orientation.pitch,
      yaw: orientation.yaw,
      distance: hypotenuse,
      x, y, z
    };
  };

  return {
    currentGroundDistance,
    formatValue,
    getPointFromCurrentOrientation,
    calculateDistanceBetweenPoints,
  };
};
