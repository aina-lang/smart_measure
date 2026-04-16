import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Plus, Zap, ZapOff, RotateCcw, Save, Settings, Layers } from 'lucide-react-native';

type Props = {
  onAddPoint: () => void;
  onReset: () => void;
  onSave: () => void;
  onOpenSettings: () => void;
  onToggleFlash: () => void;
  flashMode: boolean;
  canAddPoint: boolean;
  currentValue: string | null;
};

export const MeasurementControls = ({ 
  onAddPoint, 
  onReset, 
  onSave, 
  onOpenSettings, 
  onToggleFlash,
  flashMode,
  canAddPoint,
  currentValue
}: Props) => {
  return (
    <View className="absolute bottom-10 left-0 right-0 items-center px-6">
      {/* Current reading display */}
      {currentValue && (
        <View className="bg-black/60 px-6 py-3 rounded-2xl mb-8 border border-white/20">
          <Text className="text-white text-3xl font-bold">{currentValue}</Text>
        </View>
      )}

      <View className="flex-row items-center justify-between w-full max-w-sm">
        {/* Reset Button */}
        <TouchableOpacity 
          onPress={onReset}
          className="w-14 h-14 bg-black/40 items-center justify-center rounded-full border border-white/20"
        >
          <RotateCcw size={24} color="white" />
        </TouchableOpacity>

        {/* Main Action (Add Point) */}
        <TouchableOpacity 
          onPress={onAddPoint}
          disabled={!canAddPoint}
          className={`w-20 h-20 items-center justify-center rounded-full border-4 border-white ${canAddPoint ? 'bg-blue-600 scale-100' : 'bg-gray-600 opacity-50 scale-90'}`}
          activeOpacity={0.7}
        >
          <Plus size={40} color="white" />
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity 
          onPress={onSave}
          className="w-14 h-14 bg-black/40 items-center justify-center rounded-full border border-white/20"
        >
          <Save size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Top Controls (Floating) */}
      <View className="absolute -top-[70vh] right-6 gap-y-4">
        <TouchableOpacity 
          onPress={onToggleFlash}
          className="w-12 h-12 bg-black/40 items-center justify-center rounded-full border border-white/20"
        >
          {flashMode ? <Zap size={20} color="#FBBF24" /> : <ZapOff size={20} color="white" />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onOpenSettings}
          className="w-12 h-12 bg-black/40 items-center justify-center rounded-full border border-white/20"
        >
          <Settings size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
