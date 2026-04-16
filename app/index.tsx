import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Alert, Modal, TouchableOpacity, TextInput } from 'react-native';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { useCameraSensors } from '../hooks/useCameraSensors';
import { useMeasureLogic, Point } from '../hooks/useMeasureLogic';
import { useStore } from '../store/useStore';
import { Viewfinder } from '../components/measure/Viewfinder';
import { MeasurementControls } from '../components/measure/MeasurementControls';
import { MeasurementOverlay } from '../components/measure/MeasurementOverlay';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Check, Camera } from 'lucide-react-native';
import { TutorialModal } from '../components/ui/TutorialModal';
import { SettingsModal } from '../components/ui/SettingsModal';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

export default function MeasureScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [points, setPoints] = useState<Point[]>([]);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isTutorialVisible, setIsTutorialVisible] = useState(false);
  const [measureName, setMeasureName] = useState('');
  const viewRef = useRef(null);

  const orientation = useCameraSensors();
  const { unit, cameraHeight, addMeasure, updateSettings, hasSeenTutorial, setTutorialSeen, isLoaded } = useStore();
  const { currentGroundDistance, formatValue, getPointFromCurrentOrientation, calculateDistanceBetweenPoints } = 
    useMeasureLogic(orientation, cameraHeight);

  React.useEffect(() => {
    if (isLoaded && !hasSeenTutorial) {
      setIsTutorialVisible(true);
    }
  }, [isLoaded, hasSeenTutorial]);

  // Calcule la distance totale ou entre les deux derniers points
  const currentMeasureValue = points.length >= 2 
    ? calculateDistanceBetweenPoints(points[points.length - 2], points[points.length - 1])
    : (points.length === 1 ? null : currentGroundDistance);

  const handleAddPoint = useCallback(() => {
    const newPoint = getPointFromCurrentOrientation(Date.now().toString());
    if (newPoint) {
      setPoints(prev => [...prev, newPoint]);
    } else {
      Alert.alert("Angle invalide", "Veuillez viser le sol ou un objet plus bas que l'horizon.");
    }
  }, [getPointFromCurrentOrientation]);

  const handleReset = () => setPoints([]);

  const handleSave = () => {
    if (points.length < 1 && !currentGroundDistance) return;
    setIsSaveModalVisible(true);
  };

  const confirmSave = () => {
    const value = points.length >= 2 
      ? calculateDistanceBetweenPoints(points[points.length - 2], points[points.length - 1])
      : (points.length === 1 ? points[0].distance : (currentGroundDistance || 0));
    
    addMeasure(measureName || "Nouvelle mesure", value);
    setMeasureName('');
    setIsSaveModalVisible(false);
    Alert.alert("Succès", "Mesure sauvegardée dans l'historique !");
  };

  const takeScreenshot = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission requise", "Nous avons besoin d'accéder à votre galerie pour sauvegarder la capture.");
        return;
      }

      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Capture réussie", "L'image a été enregistrée dans votre galerie !");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de prendre la capture.");
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-black">
        <Text className="text-white text-center mb-6 text-lg">Nous avons besoin de votre caméra pour mesurer les objets.</Text>
        <TouchableOpacity 
          className="bg-blue-600 px-8 py-4 rounded-full"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-lg">Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black" ref={viewRef} collapsable={false}>
      <CameraView 
        className="flex-1" 
        flash={flash}
        facing="back"
      >
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4">
            <TouchableOpacity onPress={takeScreenshot} className="bg-black/40 p-3 rounded-full border border-white/20">
              <Camera color="white" size={20} />
            </TouchableOpacity>
            <Text className="text-white font-bold text-xl tracking-widest uppercase">Smart Measure</Text>
            <TouchableOpacity 
              onPress={() => router.push('/history')}
              className="bg-black/40 px-4 py-2 rounded-full border border-white/20"
            >
              <Text className="text-white font-medium">Historique</Text>
            </TouchableOpacity>
          </View>

          <Viewfinder />
          <MeasurementOverlay points={points} formatValue={(v) => formatValue(v, unit)} />
          
          <MeasurementControls 
            onAddPoint={handleAddPoint}
            onReset={handleReset}
            onSave={handleSave}
            onOpenSettings={() => setIsSettingsVisible(true)}
            onToggleFlash={() => setFlash(prev => prev === 'off' ? 'on' : 'off')}
            flashMode={flash === 'on'}
            canAddPoint={currentGroundDistance !== null}
            currentValue={currentMeasureValue ? formatValue(currentMeasureValue, unit) : null}
          />
        </SafeAreaView>
      </CameraView>

      <TutorialModal visible={isTutorialVisible} onClose={() => {
        setIsTutorialVisible(false);
        setTutorialSeen();
      }} />
      
      <SettingsModal 
        visible={isSettingsVisible} 
        onClose={() => setIsSettingsVisible(false)}
        unit={unit}
        cameraHeight={cameraHeight}
        onUpdate={updateSettings}
      />

      {/* Save Modal */}
      <Modal transparent visible={isSaveModalVisible} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-zinc-900 rounded-t-3xl p-8 border-t border-white/10">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-2xl font-bold">Sauvegarder</Text>
              <TouchableOpacity onPress={() => setIsSaveModalVisible(false)}>
                <X color="white" size={24} />
              </TouchableOpacity>
            </View>
            
            <Text className="text-zinc-400 mb-2">NOM DE LA MESURE</Text>
            <TextInput 
              value={measureName}
              onChangeText={setMeasureName}
              placeholder="Ex: Table salon, Mur cuisine..."
              placeholderTextColor="#555"
              className="bg-zinc-800 text-white p-4 rounded-xl text-lg mb-8"
              autoFocus
            />

            <TouchableOpacity 
              onPress={confirmSave}
              className="bg-blue-600 flex-row items-center justify-center p-4 rounded-xl"
            >
              <Check color="white" size={24} className="mr-2" />
              <Text className="text-white font-bold text-lg">Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
