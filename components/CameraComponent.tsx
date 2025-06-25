// components/CameraComponent.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';

// Try to import camera modules with fallbacks
let Camera: any = null;
let useCameraDevices: any = null;
let useFrameProcessor: any = null;
let useSharedValue: any = null;
let runOnJS: any = null;

try {
  const visionCamera = require('react-native-vision-camera');
  Camera = visionCamera.Camera;
  useCameraDevices = visionCamera.useCameraDevices;
  useFrameProcessor = visionCamera.useFrameProcessor;
} catch (error) {
  console.log('Vision Camera not available:', error);
}

try {
  const reanimated = require('react-native-reanimated');
  useSharedValue = reanimated.useSharedValue;
  runOnJS = reanimated.runOnJS;
} catch (error) {
  console.log('Reanimated not available:', error);
}

interface CameraComponentProps {
  selectedMovement: string;
  onVideoRecorded?: (video: any) => void;
  onAnalysisComplete?: (results: any) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  selectedMovement,
  onVideoRecorded,
  onAnalysisComplete,
}) => {
  // Check if camera libraries are available
  const [librariesAvailable, setLibrariesAvailable] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);

  // Timer ref for recording duration
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkLibraries();
  }, []);

  const checkLibraries = () => {
    if (Camera && useCameraDevices) {
      setLibrariesAvailable(true);
      checkCameraPermission();
    } else {
      setLibrariesAvailable(false);
    }
  };

  const checkCameraPermission = async () => {
    if (!Camera) return;
    
    try {
      const permission = await Camera.getCameraPermissionStatus();
      if (permission === 'authorized') {
        setHasPermission(true);
      } else {
        const newPermission = await Camera.requestCameraPermission();
        setHasPermission(newPermission === 'authorized');
      }
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Camera Error', 'Unable to access camera permissions');
    }
  };

  // Start mock recording (when camera not available)
  const startMockRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);

    recordingTimer.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 5) { // Auto-stop after 5 seconds for demo
          stopMockRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Stop mock recording
  const stopMockRecording = () => {
    setIsRecording(false);
    
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }

    // Simulate video processing
    setTimeout(() => {
      onAnalysisComplete?.({
        movement: selectedMovement,
        duration: recordingTime,
        videoPath: 'mock://video/path',
        score: Math.floor(Math.random() * 30) + 70,
        feedback: [
          'Good form detected',
          'Consistent movement pattern',
          'Try to maintain tempo'
        ]
      });
    }, 1000);
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopMockRecording();
    } else {
      startMockRecording();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCameraGuidance = () => {
    switch (selectedMovement) {
      case 'squat':
        return 'Position camera to show full body from the side. Ensure you can see from head to feet.';
      case 'bench':
        return 'Position camera to show upper body and bar path. Side angle preferred.';
      case 'deadlift':
        return 'Position camera to show full body from the side. Capture entire lift movement.';
      default:
        return 'Position camera to capture your full movement range.';
    }
  };

  // If libraries aren't available, show setup instructions
  if (!librariesAvailable) {
    return (
      <View style={styles.setupContainer}>
        <Text style={styles.setupIcon}>📷</Text>
        <Text style={styles.setupTitle}>Camera Setup Required</Text>
        <Text style={styles.setupMessage}>
          To enable camera functionality, please install the required dependencies:
        </Text>
        
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>npm install react-native-vision-camera</Text>
          <Text style={styles.codeText}>npm install react-native-reanimated</Text>
          <Text style={styles.codeText}>cd ios && bundle exec pod install</Text>
        </View>

        <Text style={styles.setupNote}>
          For now, you can test with the mock camera below:
        </Text>

        <TouchableOpacity 
          style={styles.mockButton} 
          onPress={handleRecordPress}
        >
          <Text style={styles.mockButtonText}>
            {isRecording ? 'Stop Mock Recording' : 'Start Mock Recording'}
          </Text>
        </TouchableOpacity>

        {isRecording && (
          <View style={styles.mockRecording}>
            <Text style={styles.mockRecordingText}>
              📹 Mock Recording: {formatTime(recordingTime)}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // If camera is available but no permission
  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>📷</Text>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionMessage}>
          To analyze your weightlifting form, we need access to your camera.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={checkCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get camera devices
  const devices = useCameraDevices?.() || [];
  const device = devices.find((d: any) => d.position === 'back') || devices[0];

  if (!device) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>📷</Text>
        <Text style={styles.errorTitle}>Camera Not Available</Text>
        <Text style={styles.errorMessage}>
          Unable to access camera device. Please check your device settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Camera Preview */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video={true}
        audio={false}
        preset="medium"
      />

      {/* Camera Overlay */}
      <View style={styles.overlay}>
        {/* Top Info Bar */}
        <View style={styles.topBar}>
          <View style={styles.movementIndicator}>
            <Text style={styles.movementText}>{selectedMovement.toUpperCase()}</Text>
          </View>
          
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
            </View>
          )}
        </View>

        {/* Camera Guidance */}
        <View style={styles.guidanceContainer}>
          <Text style={styles.guidanceText}>{getCameraGuidance()}</Text>
        </View>

        {/* Recording Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive
            ]}
            onPress={handleRecordPress}
            activeOpacity={0.8}
          >
            <View style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonInnerActive
            ]} />
          </TouchableOpacity>
        </View>

        {/* Bottom Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            {isRecording 
              ? 'Tap to stop recording and analyze'
              : 'Tap to start recording your set'
            }
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  // Setup screen
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
    padding: 30,
  },
  setupIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 16,
    textAlign: 'center',
  },
  setupMessage: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  codeContainer: {
    backgroundColor: '#27272a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#22c55e',
    marginBottom: 4,
  },
  setupNote: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 24,
  },
  mockButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  mockButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  mockRecording: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mockRecordingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Permission states
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
    padding: 40,
  },
  permissionText: {
    fontSize: 64,
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Error states
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
    padding: 40,
  },
  errorText: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Camera overlay
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  movementIndicator: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  movementText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  recordingTime: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Guidance
  guidanceContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  guidanceText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    borderRadius: 12,
    lineHeight: 22,
  },

  // Controls
  controlsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  recordButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: '#ef4444',
  },
  recordButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
  },
  recordButtonInnerActive: {
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },

  // Instructions
  instructionsContainer: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
  },
  instructionsText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    borderRadius: 12,
  },
});

export default CameraComponent;