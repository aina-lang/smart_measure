import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

export const Viewfinder = () => {
  return (
    <View className="absolute inset-0 items-center justify-center pointer-events-none">
      <Svg height="60" width="60" viewBox="0 0 100 100">
        <Circle 
          cx="50" cy="50" r="48" 
          stroke="white" strokeWidth="2" fill="none" opacity="0.5" 
        />
        <Circle 
          cx="50" cy="50" r="2" 
          fill="#3B82F6" 
        />
        <Line x1="50" y1="20" x2="50" y2="40" stroke="white" strokeWidth="2" />
        <Line x1="50" y1="60" x2="50" y2="80" stroke="white" strokeWidth="2" />
        <Line x1="20" y1="50" x2="40" y2="50" stroke="white" strokeWidth="2" />
        <Line x1="60" y1="50" x2="80" y2="50" stroke="white" strokeWidth="2" />
      </Svg>
    </View>
  );
};
