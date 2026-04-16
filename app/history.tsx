import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useStore } from '../store/useStore';
import { useRouter } from 'expo-router';
import { ChevronLeft, Trash2, Calendar, Ruler } from 'lucide-react-native';

export default function HistoryScreen() {
  const router = useRouter();
  const { history, removeMeasure, formatValue, unit } = useStore();

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-zinc-900 mb-4 p-5 rounded-2xl border border-white/5 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-white text-lg font-bold mb-1">{item.name}</Text>
        <View className="flex-row items-center gap-x-3">
          <View className="flex-row items-center">
            <Calendar size={14} color="#71717a" />
            <Text className="text-zinc-500 text-sm ml-1">
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ruler size={14} color="#3b82f6" />
            <Text className="text-blue-400 text-sm font-medium ml-1">
              {item.value.toFixed(2)}m
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={() => removeMeasure(item.id)}
        className="bg-red-500/10 p-3 rounded-full"
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center py-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-zinc-900 border border-white/10"
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold ml-4">Historique</Text>
        </View>

        {history.length === 0 ? (
          <View className="flex-1 items-center justify-center opacity-40">
            <Ruler size={64} color="white" strokeWidth={1} />
            <Text className="text-white text-center mt-4 text-lg">Aucune mesure enregistrée</Text>
          </View>
        ) : (
          <FlatList 
            data={history}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
