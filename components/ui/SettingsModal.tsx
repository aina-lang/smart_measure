import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Ruler, X, Check } from 'lucide-react-native';
import { Unit } from '../hooks/useMeasureLogic';

type Props = {
  visible: boolean;
  onClose: () => void;
  unit: Unit;
  cameraHeight: number;
  onUpdate: (unit: Unit, height: number) => void;
};

export const SettingsModal = ({ visible, onClose, unit, cameraHeight, onUpdate }: Props) => {
  const [tempHeight, setTempHeight] = useState(cameraHeight.toString());
  const [tempUnit, setTempUnit] = useState<Unit>(unit);

  const handleSave = () => {
    const height = parseFloat(tempHeight);
    if (!isNaN(height) && height > 0) {
      onUpdate(tempUnit, height);
      onClose();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-zinc-900 rounded-t-[40px] p-8 border-t border-white/10">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-white text-2xl font-bold">Réglages</Text>
            <TouchableOpacity onPress={onClose} className="bg-zinc-800 p-2 rounded-full">
              <X color="white" size={24} />
            </TouchableOpacity>
          </View>

          {/* Unit Selector */}
          <Text className="text-zinc-500 font-bold mb-4 uppercase tracking-widest text-xs">Unité de mesure</Text>
          <View className="flex-row bg-zinc-800 rounded-2xl p-1 mb-8">
            {(['cm', 'm', 'in'] as Unit[]).map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setTempUnit(u)}
                className={`flex-1 py-3 items-center rounded-xl ${tempUnit === u ? 'bg-blue-600' : ''}`}
              >
                <Text className={`font-bold ${tempUnit === u ? 'text-white' : 'text-zinc-500'}`}>
                  {u === 'in' ? 'pouces' : u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Camera Height */}
          <Text className="text-zinc-500 font-bold mb-4 uppercase tracking-widest text-xs">Hauteur de l'appareil (m)</Text>
          <View className="bg-zinc-800 rounded-2xl p-4 flex-row items-center mb-10">
            <Ruler size={20} color="#3b82f6" />
            <TextInput
              value={tempHeight}
              onChangeText={setTempHeight}
              keyboardType="numeric"
              className="flex-1 text-white text-lg ml-4 font-bold"
              placeholder="1.6"
              placeholderTextColor="#555"
            />
          </View>

          <TouchableOpacity 
            onPress={handleSave}
            className="bg-blue-600 w-full py-5 rounded-3xl flex-row items-center justify-center"
          >
            <Check color="white" size={24} />
            <Text className="text-white font-bold text-xl ml-2">Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
