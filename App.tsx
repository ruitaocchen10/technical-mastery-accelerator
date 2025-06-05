// App.tsx - TypeScript Simplified Version
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';

interface Movement {
  id: string;
  name: string;
  icon: string;
}

const App: React.FC = () => {
  const [selectedMovement, setSelectedMovement] = useState<string>('squat');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const movements: Movement[] = [
    { id: 'squat', name: 'Squat', icon: '🏋️' },
    { id: 'bench', name: 'Bench Press', icon: '💪' },
    { id: 'deadlift', name: 'Deadlift', icon: '⚡' }
  ];

  const startAnalysis = (): void => {
    setIsAnalyzing(true);
    Alert.alert(
      'Analysis Started', 
      `Starting ${selectedMovement} analysis...`,
      [{ text: 'Stop', onPress: () => setIsAnalyzing(false) }]
    );
  };

  const handleMovementSelect = (movementId: string): void => {
    setSelectedMovement(movementId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Technical Mastery</Text>
        <Text style={styles.subtitle}>AI Weightlifting Coach</Text>
      </View>

      {/* Movement Selection */}
      <View style={styles.movementSelector}>
        <Text style={styles.sectionTitle}>Select Movement</Text>
        {movements.map((movement: Movement) => (
          <TouchableOpacity
            key={movement.id}
            style={[
              styles.movementButton,
              selectedMovement === movement.id && styles.selectedMovement
            ]}
            onPress={() => handleMovementSelect(movement.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.movementIcon}>{movement.icon}</Text>
            <Text style={styles.movementText}>{movement.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Camera Placeholder */}
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>
          📷 Camera View
        </Text>
        <Text style={styles.placeholderSubtext}>
          Camera integration coming next...
        </Text>
        
        {isAnalyzing && (
          <View style={styles.analysisIndicator}>
            <Text style={styles.analysisText}>
              🔍 Analyzing {selectedMovement}...
            </Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.startButton,
            isAnalyzing && styles.activeButton
          ]}
          onPress={startAnalysis}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status */}
      <View style={styles.status}>
        <Text style={styles.statusText}>
          Status: Ready for {selectedMovement} analysis
        </Text>
        <Text style={styles.versionText}>
          MVP v1.0 - TypeScript Structure Test
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#16213e',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 4,
    fontWeight: '300',
  },
  movementSelector: {
    padding: 20,
    backgroundColor: '#0f3460',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  movementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedMovement: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
    transform: [{ scale: 1.02 }],
  },
  movementIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  movementText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: '#e94560',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '500',
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    fontWeight: '300',
  },
  analysisIndicator: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(233, 69, 96, 0.9)',
    borderRadius: 10,
    shadowColor: '#e94560',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  analysisText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controls: {
    padding: 20,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  activeButton: {
    backgroundColor: '#ff6b6b',
    shadowColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  status: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '400',
  },
  versionText: {
    color: '#a0a0a0',
    fontSize: 12,
    fontWeight: '300',
  },
});

export default App;