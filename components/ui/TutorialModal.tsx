import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ruler, Target, CheckCircle2, Info } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const steps = [
  {
    title: "Visez le sol",
    description: "Tenez votre téléphone à une hauteur confortable (environ 1.5m). Visez la base de l'objet au sol.",
    icon: <Target size={48} color="#3b82f6" />,
  },
  {
    title: "Placez des points",
    description: "Appuyez sur le bouton '+' pour fixer un point A. Déplacez-vous et fixez un point B pour mesurer la distance entre eux.",
    icon: <Ruler size={48} color="#3b82f6" />,
  },
  {
    title: "Sauvegardez",
    description: "Une fois la mesure prise, appuyez sur l'icône de disquette pour l'enregistrer dans votre historique.",
    icon: <CheckCircle2 size={48} color="#3b82f6" />,
  }
];

export const TutorialModal = ({ visible, onClose }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/90 items-center justify-center p-6">
        <View className="bg-zinc-900 w-full max-w-sm rounded-[40px] p-8 border border-white/10 items-center">
          <View className="w-24 h-24 bg-blue-600/10 rounded-full items-center justify-center mb-6">
            {steps[currentStep].icon}
          </View>

          <Text className="text-white text-2xl font-bold text-center mb-4">
            {steps[currentStep].title}
          </Text>
          
          <Text className="text-zinc-400 text-center text-lg leading-6 mb-10">
            {steps[currentStep].description}
          </Text>

          {/* Indicators */}
          <View className="flex-row gap-x-2 mb-8">
            {steps.map((_, i) => (
              <View 
                key={i} 
                className={`h-2 rounded-full ${i === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-zinc-700'}`} 
              />
            ))}
          </View>

          <TouchableOpacity 
            onPress={handleNext}
            className="bg-blue-600 w-full py-5 rounded-3xl items-center"
          >
            <Text className="text-white font-bold text-xl">
              {currentStep === steps.length - 1 ? "Compris !" : "Suivant"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
