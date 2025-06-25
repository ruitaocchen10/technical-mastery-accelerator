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
  Platform,
} from 'react-native';

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

const colors = {
  // Primary colors (keeping the professional blue)
  primary: '#3b82f6',        // Slightly brighter blue for dark theme
  primaryLight: '#60a5fa',   // Lighter blue
  primaryDark: '#2563eb',    // Darker blue
  
  // Dark theme grays
  gray50: '#18181b',         // Very dark (main backgrounds)
  gray100: '#27272a',        // Dark (secondary backgrounds)
  gray200: '#3f3f46',        // Medium dark (borders)
  gray300: '#52525b',        // Medium (subtle borders)
  gray400: '#71717a',        // Medium light (disabled text)
  gray500: '#a1a1aa',        // Light (secondary text)
  gray600: '#d4d4d8',        // Very light (primary text)
  gray700: '#e4e4e7',        // Almost white
  gray800: '#f4f4f5',        // White
  gray900: '#fafafa',        // Pure white
  
  // Status colors (adjusted for dark theme)
  success: '#22c55e',        // Brighter green
  warning: '#f59e0b',        // Orange
  error: '#ef4444',          // Red
  
  // Base colors
  white: '#ffffff',
  black: '#000000',
  
  // Dark theme specific
  background: '#09090b',      // Main background (very dark)
  backgroundSecondary: '#18181b', // Secondary background (dark)
  surface: '#27272a',         // Card/surface background (medium dark)
  
  // Text colors for dark theme
  textPrimary: '#fafafa',     // Primary text (almost white)
  textSecondary: '#a1a1aa',   // Secondary text (medium gray)
  textTertiary: '#71717a',    // Tertiary text (darker gray)
  
  // Border colors
  border: '#3f3f46',          // Subtle borders
  borderLight: '#27272a',     // Very subtle borders
};

const typography = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

const styles = StyleSheet.create({
  // Main layout
  container: {
    flex: 1,
    backgroundColor: colors.background, // Now very dark
  },
  
  // Header section (dark version)
  header: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: colors.surface, // Dark surface
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, // Stronger shadow for dark theme
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '700', // Bold
    fontFamily: getFontFamily('bold'),
    color: colors.textPrimary, // Now almost white
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400', // Regular
    fontFamily: getFontFamily('medium'),
    color: colors.textSecondary, // Medium gray
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  
  // Movement selector (dark)
  movementSelector: {
    padding: 24,
    backgroundColor: colors.backgroundSecondary, // Dark background
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600', // Semibold
    fontFamily: getFontFamily('semibold'),
    color: colors.textPrimary, // Almost white
    marginBottom: 16,
    textAlign: 'center',
  },
  movementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.surface, // Dark surface
    borderWidth: 1.5,
    borderColor: colors.border, // Subtle border
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3, // Stronger shadow
    shadowRadius: 2,
    elevation: 1,
  },
 selectedMovement: {
  backgroundColor: colors.primary,
  borderColor: colors.primary,
  shadowColor: colors.primary,
  shadowOpacity: 0.4,
  shadowRadius: 6, // Bigger glow
  elevation: 4, // Higher elevation
  transform: [{ scale: 1.02 }], // Slightly larger
},
  movementText: {
    fontSize: 16,
    fontWeight: '500', // Medium
    fontFamily: getFontFamily('medium'),
    color: colors.textPrimary, // Almost white
    flex: 1,
  },
  movementIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  // Camera placeholder (dark)
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 24,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    minHeight: 220, // Slightly taller
    position: 'relative',
  },
  placeholderText: {
    fontSize: 22, // Larger
    fontWeight: '600', // Bolder
    fontFamily: getFontFamily('semibold'),
    color: colors.textSecondary,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 15, // Slightly larger
    fontWeight: '400',
    fontFamily: getFontFamily('regular'),
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: 20, // Add some padding
  },
  analysisIndicator: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisText: {
    fontSize: 16,
    fontWeight: '600', // Semibold
    fontFamily: getFontFamily('medium'),
    color: colors.white,
    textAlign: 'center',
  },
  
  // Controls (dark)
  controls: {
    padding: 24,
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
  activeButton: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600', // Semibold
    fontFamily: getFontFamily('semibold'),
    color: colors.white,
    letterSpacing: 0.2,
  },
  
  // Status (dark)
  status: {
    padding: 24,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500', // Medium
    fontFamily: getFontFamily('medium'),
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '400', // Regular
    fontFamily: getFontFamily('regular'),
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

export default App;