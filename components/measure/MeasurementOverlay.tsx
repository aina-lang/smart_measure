import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { Point } from '../../hooks/useMeasureLogic';

type Props = {
  points: Point[];
  formatValue: (meters: number) => string;
};

export const MeasurementOverlay = ({ points, formatValue }: Props) => {
  // En l'absence d'AR pure, les points sont "ancrés" à l'écran là où ils ont été placés.
  // Note: Pour une version plus avancée, on utiliserait le yaw/pitch pour les faire bouger avec le téléphone.
  // Pour cette version simple, on affiche les points de la session actuelle.
  
  return (
    <View className="absolute inset-0 pointer-events-none">
      <Svg height="100%" width="100%">
        {points.map((point, index) => {
          const nextPoint = points[index + 1];
          // Ici on simule la position à l'écran. Comme on n'a pas de projection 3D exacte sans AR,
          //On va assumer que le point est centré au moment de la création.
          
          return (
            <React.Fragment key={point.id}>
              {/* Point */}
              <Circle 
                cx="50%" cy="50%" r="6" 
                fill="#3B82F6" stroke="white" strokeWidth="2"
                opacity={index === points.length - 1 ? 1 : 0.5}
              />
              
              {/* Line to next point logic (Simulated for visualization) */}
              {/* Dans une version 2D simple sans AR, les lignes complexes sont difficiles à projeter.
                  On affiche simplement les points pour l'instant. */}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};
