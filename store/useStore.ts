import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Unit } from '../hooks/useMeasureLogic';

export type SavedMeasure = {
  id: string;
  name: string;
  value: number; // en mètres
  unit: Unit;
  date: number;
};

const STORAGE_KEYS = {
  HISTORY: 'SMART_MEASURE_HISTORY',
  SETTINGS: 'SMART_MEASURE_SETTINGS',
  TUTORIAL: 'SMART_MEASURE_TUTORIAL',
};

export const useStore = () => {
  const [history, setHistory] = useState<SavedMeasure[]>([]);
  const [unit, setUnit] = useState<Unit>('m');
  const [cameraHeight, setCameraHeight] = useState<number>(1.6);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      const storedSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      const storedTutorial = await AsyncStorage.getItem(STORAGE_KEYS.TUTORIAL);

      if (storedHistory) setHistory(JSON.parse(storedHistory));
      if (storedTutorial) setHasSeenTutorial(true);
      if (storedSettings) {
        const { unit, cameraHeight } = JSON.parse(storedSettings);
        if (unit) setUnit(unit);
        if (cameraHeight) setCameraHeight(cameraHeight);
      }
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const setTutorialSeen = async () => {
    setHasSeenTutorial(true);
    await AsyncStorage.setItem(STORAGE_KEYS.TUTORIAL, 'true');
  };

  const saveData = async (newHistory: SavedMeasure[], newUnit: Unit, newHeight: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ unit: newUnit, cameraHeight: newHeight }));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };

  const addMeasure = (name: string, value: number) => {
    const newMeasure: SavedMeasure = {
      id: Date.now().toString(),
      name,
      value,
      unit,
      date: Date.now(),
    };
    const newHistory = [newMeasure, ...history];
    setHistory(newHistory);
    saveData(newHistory, unit, cameraHeight);
  };

  const removeMeasure = (id: string) => {
    const newHistory = history.filter(m => m.id !== id);
    setHistory(newHistory);
    saveData(newHistory, unit, cameraHeight);
  };

  const renameMeasure = (id: string, newName: string) => {
    const newHistory = history.map(m => m.id === id ? { ...m, name: newName } : m);
    setHistory(newHistory);
    saveData(newHistory, unit, cameraHeight);
  };

  const updateSettings = (newUnit: Unit, newHeight: number) => {
    setUnit(newUnit);
    setCameraHeight(newHeight);
    saveData(history, newUnit, newHeight);
  };

  return {
    history,
    unit,
    cameraHeight,
    hasSeenTutorial,
    isLoaded,
    addMeasure,
    removeMeasure,
    renameMeasure,
    updateSettings,
    setTutorialSeen,
  };
};
