// App.tsx - Updated with Camera Integration
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import CameraComponent from './components/CameraComponent';

const getFontFamily = (weight = 'regular') => {
  if (Platform.OS === 'ios') {
    switch (weight) {
      case 'light': return 'Avenir Next Light';
      case 'regular': return 'Avenir Next Regular';
      case 'medium': return 'Avenir Next Medium';
      case 'semibold': return 'Avenir Next Semibold';
      case 'bold': return 'Avenir Next Bold';
      default: return 'Avenir Next';
    }
  } else {
    switch (weight) {
      case 'light': return 'Roboto-Light';
      case 'regular': return 'Roboto-Regular';
      case 'medium': return 'Roboto-Medium';
      case 'bold': return 'Roboto-Bold';
      default: return 'Roboto';
    }
  }
};

interface Movement {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface AnalysisResult {
  movement: string;
  duration: number;
  videoPath: string;
  score: number;
  feedback: string[];
}

const App: React.FC = () => {
  const [selectedMovement, setSelectedMovement] = useState<string>('squat');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const movements: Movement[] = [
    { 
      id: 'squat', 
      name: 'Squat', 
      icon: '🏋️',
      description: 'Analyze squat depth, knee tracking, and posture'
    },
    { 
      id: 'bench', 
      name: 'Bench Press', 
      icon: '💪',
      description: 'Check bar path, elbow position, and symmetry'
    },
    { 
      id: 'deadlift', 
      name: 'Deadlift', 
      icon: '⚡',
      description: 'Evaluate hip hinge, back position, and bar path'
    }
  ];

  const startAnalysis = (): void => {
    setIsCameraActive(true);
  };

  const handleMovementSelect = (movementId: string): void => {
    setSelectedMovement(movementId);
  };

  const handleVideoRecorded = (video: any): void => {
    console.log('Video recorded:', video.path);
    // Here you could save the video or trigger additional processing
  };

  const handleAnalysisComplete = (results: AnalysisResult): void => {
    setLastAnalysis(results);
    setIsCameraActive(false);
    setShowResults(true);
  };

  const closeCameraModal = (): void => {
    setIsCameraActive(false);
  };

  const closeResultsModal = (): void => {
    setShowResults(false);
  };

  const getSelectedMovement = (): Movement => {
    return movements.find(m => m.id === selectedMovement) || movements[0];
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
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
            <View style={styles.movementInfo}>
              <Text style={[
                styles.movementText,
                selectedMovement === movement.id && styles.selectedMovementText
              ]}>
                {movement.name}
              </Text>
              <Text style={[
                styles.movementDescription,
                selectedMovement === movement.id && styles.selectedMovementDescription
              ]}>
                {movement.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Camera Preview Area */}
      <View style={styles.previewArea}>
        <Text style={styles.previewTitle}>
          Ready to analyze: {getSelectedMovement().name}
        </Text>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.placeholderText}>📷</Text>
          <Text style={styles.placeholderSubtext}>
            Tap "Start Recording" to begin analysis
          </Text>
          
          {lastAnalysis && (
            <TouchableOpacity 
              style={styles.lastResultsButton}
              onPress={() => setShowResults(true)}
            >
              <Text style={styles.lastResultsText}>
                View Last Results ({lastAnalysis.score}/100)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={startAnalysis}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start Recording</Text>
        </TouchableOpacity>
      </View>

      {/* Status */}
      <View style={styles.status}>
        <Text style={styles.statusText}>
          Ready to record {getSelectedMovement().name.toLowerCase()} analysis
        </Text>
        <Text style={styles.versionText}>
          MVP v1.1 - Camera Integration Active
        </Text>
      </View>

      {/* Camera Modal */}
      <Modal
        visible={isCameraActive}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeCameraModal}
      >
        <View style={styles.cameraModal}>
          <CameraComponent
            selectedMovement={selectedMovement}
            onVideoRecorded={handleVideoRecorded}
            onAnalysisComplete={handleAnalysisComplete}
          />
          
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeCameraModal}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Results Modal */}
      <Modal
        visible={showResults}
        animationType="slide"
        transparent={true}
        onRequestClose={closeResultsModal}
      >
        <View style={styles.resultsOverlay}>
          <View style={styles.resultsModal}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Analysis Results</Text>
              <TouchableOpacity
                style={styles.resultsCloseButton}
                onPress={closeResultsModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {lastAnalysis && (
              <View style={styles.resultsContent}>
                <View style={styles.scoreSection}>
                  <Text style={styles.movementTitle}>
                    {lastAnalysis.movement.toUpperCase()}
                  </Text>
                  <Text style={[
                    styles.scoreText,
                    { color: getScoreColor(lastAnalysis.score) }
                  ]}>
                    {lastAnalysis.score}/100
                  </Text>
                  <Text style={[
                    styles.scoreLabel,
                    { color: getScoreColor(lastAnalysis.score) }
                  ]}>
                    {getScoreLabel(lastAnalysis.score)}
                  </Text>
                </View>

                <View style={styles.feedbackSection}>
                  <Text style={styles.feedbackTitle}>Feedback</Text>
                  {lastAnalysis.feedback.map((item, index) => (
                    <View key={index} style={styles.feedbackItem}>
                      <Text style={styles.feedbackBullet}>•</Text>
                      <Text style={styles.feedbackText}>{item}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailsText}>
                    Duration: {lastAnalysis.duration}s
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.recordAgainButton}
              onPress={() => {
                closeResultsModal();
                startAnalysis();
              }}
            >
              <Text style={styles.recordAgainText}>Record Another Set</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const colors = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#09090b',
  backgroundSecondary: '#18181b',
  surface: '#27272a',
  textPrimary: '#fafafa',
  textSecondary: '#a1a1aa',
  textTertiary: '#71717a',
  border: '#3f3f46',
  white: '#ffffff',
  black: '#000000',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header
  header: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: getFontFamily('bold'),
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: getFontFamily('medium'),
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // Movement selector
  movementSelector: {
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getFontFamily('semibold'),
    color: colors.textPrimary,
    marginBottom: 12,
  },
  movementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedMovement: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  movementIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  movementInfo: {
    flex: 1,
  },
  movementText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: getFontFamily('medium'),
    color: colors.textPrimary,
    marginBottom: 2,
  },
  selectedMovementText: {
    color: colors.white,
  },
  movementDescription: {
    fontSize: 12,
    color: colors.textTertiary,
    fontFamily: getFontFamily('regular'),
  },
  selectedMovementDescription: {
    color: colors.white,
    opacity: 0.9,
  },
  
  // Preview area
  previewArea: {
    flex: 1,
    padding: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    minHeight: 200,
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: 16,
  },
  lastResultsButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lastResultsText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Controls
  controls: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getFontFamily('semibold'),
    color: colors.white,
  },
  
  // Status
  status: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: getFontFamily('medium'),
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: getFontFamily('regular'),
    color: colors.textTertiary,
    textAlign: 'center',
  },

  // Camera Modal
  cameraModal: {
    flex: 1,
    backgroundColor: colors.black,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Results Modal
  resultsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsModal: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: getFontFamily('bold'),
  },
  resultsCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContent: {
    marginBottom: 24,
  },
  
  // Score section
  scoreSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  movementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    fontFamily: getFontFamily('semibold'),
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold'),
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getFontFamily('semibold'),
  },
  
  // Feedback section
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    fontFamily: getFontFamily('semibold'),
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  feedbackBullet: {
    color: colors.primary,
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: getFontFamily('regular'),
  },
  
  // Details section
  detailsSection: {
    padding: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  detailsText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    fontFamily: getFontFamily('regular'),
  },
  
  // Record again button
  recordAgainButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  recordAgainText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getFontFamily('semibold'),
  },
});

export default App;