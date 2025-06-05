// components/FormAnalyzer.tsx
export interface KeyPoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface PoseData {
  keypoints: { [key: string]: KeyPoint };
  timestamp: number;
}

export interface FormFeedback {
  score: number;
  feedback: string[];
  errors: string[];
  repCompleted?: boolean;
  details?: { [key: string]: number };
}

class FormAnalyzer {
  static analyze(movement: string, poseData: PoseData): FormFeedback {
    if (!poseData || !poseData.keypoints) {
      return { score: 0, feedback: [], errors: [] };
    }

    switch (movement) {
      case 'squat':
        return this.analyzeSquat(poseData);
      case 'bench':
        return this.analyzeBench(poseData);
      case 'deadlift':
        return this.analyzeDeadlift(poseData);
      default:
        return { score: 0, feedback: [], errors: [] };
    }
  }

  private static analyzeSquat(poseData: PoseData): FormFeedback {
    const { keypoints } = poseData;
    const errors: string[] = [];
    const feedback: string[] = [];
    let score = 100;

    // Check if we have the required keypoints
    const requiredPoints = ['leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'];
    const hasRequiredPoints = requiredPoints.every(point => keypoints[point]);

    if (!hasRequiredPoints) {
      return { 
        score: 0, 
        feedback: ['Position yourself so your full body is visible'], 
        errors: ['Incomplete pose detection'] 
      };
    }

    // Calculate angles and positions
    const leftHip = keypoints.leftHip;
    const rightHip = keypoints.rightHip;
    const leftKnee = keypoints.leftKnee;
    const rightKnee = keypoints.rightKnee;
    const leftAnkle = keypoints.leftAnkle;
    const rightAnkle = keypoints.rightAnkle;

    // 1. Depth Analysis
    const hipHeight = (leftHip.y + rightHip.y) / 2;
    const kneeHeight = (leftKnee.y + rightKnee.y) / 2;
    const depthRatio = (kneeHeight - hipHeight) / (leftAnkle.y - hipHeight);

    if (depthRatio < 0.1) {
      errors.push('Squat deeper - hips need to go below knee level');
      score -= 25;
    } else if (depthRatio < 0.3) {
      feedback.push('Good depth! Try to go slightly deeper');
      score -= 5;
    } else {
      feedback.push('Excellent depth!');
    }

    // 2. Knee Valgus (Knee Cave) Detection
    const kneeWidth = Math.abs(rightKnee.x - leftKnee.x);
    const hipWidth = Math.abs(rightHip.x - leftHip.x);
    const kneeCollapseRatio = kneeWidth / hipWidth;

    if (kneeCollapseRatio < 0.7) {
      errors.push('Knees caving in - push knees out over toes');
      score -= 30;
    } else if (kneeCollapseRatio < 0.85) {
      feedback.push('Watch knee alignment - keep them tracking over toes');
      score -= 10;
    } else {
      feedback.push('Great knee tracking!');
    }

    // 3. Forward Lean Analysis
    let forwardLean = 0;
    if (keypoints.leftShoulder && keypoints.rightShoulder) {
      const shoulderCenter = {
        x: (keypoints.leftShoulder.x + keypoints.rightShoulder.x) / 2,
        y: (keypoints.leftShoulder.y + keypoints.rightShoulder.y) / 2,
      };
      const hipCenter = {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2,
      };

      forwardLean = Math.abs(shoulderCenter.x - hipCenter.x);
      
      if (forwardLean > 0.1) {
        errors.push('Too much forward lean - keep chest up');
        score -= 20;
      } else if (forwardLean > 0.05) {
        feedback.push('Slight forward lean - focus on keeping chest up');
        score -= 5;
      } else {
        feedback.push('Good upright posture!');
      }
    }

    // 4. Symmetry Check
    const leftLegLength = Math.sqrt(
      Math.pow(leftKnee.x - leftHip.x, 2) + Math.pow(leftKnee.y - leftHip.y, 2)
    );
    const rightLegLength = Math.sqrt(
      Math.pow(rightKnee.x - rightHip.x, 2) + Math.pow(rightKnee.y - rightHip.y, 2)
    );
    const asymmetry = Math.abs(leftLegLength - rightLegLength) / Math.max(leftLegLength, rightLegLength);

    if (asymmetry > 0.15) {
      errors.push('Uneven squat - check your stance and balance');
      score -= 15;
    }

    // Determine if this is a completed rep
    const repCompleted = depthRatio > 0.2 && this.detectBottomPosition(poseData);

    return {
      score: Math.max(0, score),
      feedback,
      errors,
      repCompleted,
      details: {
        depth: depthRatio,
        kneeTracking: kneeCollapseRatio,
        forwardLean,
        symmetry: asymmetry,
      }
    };
  }

  private static analyzeBench(poseData: PoseData): FormFeedback {
    const { keypoints } = poseData;
    const errors: string[] = [];
    const feedback: string[] = [];
    let score = 100;

    // Check for required keypoints
    const requiredPoints = ['leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist', 'rightWrist'];
    const hasRequiredPoints = requiredPoints.every(point => keypoints[point]);

    if (!hasRequiredPoints) {
      return { 
        score: 0, 
        feedback: ['Position camera to show your upper body clearly'], 
        errors: ['Incomplete pose detection'] 
      };
    }

    const leftShoulder = keypoints.leftShoulder;
    const rightShoulder = keypoints.rightShoulder;
    const leftElbow = keypoints.leftElbow;
    const rightElbow = keypoints.rightElbow;
    const leftWrist = keypoints.leftWrist;
    const rightWrist = keypoints.rightWrist;

    // 1. Elbow Flare Analysis
    const leftElbowAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

    if (avgElbowAngle > 100) {
      errors.push('Elbows too flared - bring them closer to your body');
      score -= 25;
    } else if (avgElbowAngle > 85) {
      feedback.push('Slight elbow flare - try to keep elbows at 45-degree angle');
      score -= 10;
    } else {
      feedback.push('Good elbow position!');
    }

    // 2. Bar Path Analysis (approximated by wrist position)
    const wristCenter = {
      x: (leftWrist.x + rightWrist.x) / 2,
      y: (leftWrist.y + rightWrist.y) / 2,
    };
    const shoulderCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
    };

    const barDeviation = Math.abs(wristCenter.x - shoulderCenter.x);
    if (barDeviation > 0.08) {
      errors.push('Bar drifting - keep it over your shoulders');
      score -= 20;
    } else if (barDeviation > 0.04) {
      feedback.push('Minor bar drift - focus on straight up and down');
      score -= 5;
    } else {
      feedback.push('Great bar path!');
    }

    // 3. Symmetry Check
    const leftArmExtension = Math.sqrt(
      Math.pow(leftWrist.x - leftShoulder.x, 2) + Math.pow(leftWrist.y - leftShoulder.y, 2)
    );
    const rightArmExtension = Math.sqrt(
      Math.pow(rightWrist.x - rightShoulder.x, 2) + Math.pow(rightWrist.y - rightShoulder.y, 2)
    );
    const asymmetry = Math.abs(leftArmExtension - rightArmExtension) / Math.max(leftArmExtension, rightArmExtension);

    if (asymmetry > 0.1) {
      errors.push('Uneven press - check your grip and shoulder position');
      score -= 15;
    }

    const repCompleted = this.detectPressMovement(poseData);

    return {
      score: Math.max(0, score),
      feedback,
      errors,
      repCompleted,
      details: {
        elbowAngle: avgElbowAngle,
        barPath: barDeviation,
        symmetry: asymmetry,
      }
    };
  }

  private static analyzeDeadlift(poseData: PoseData): FormFeedback {
    const { keypoints } = poseData;
    const errors: string[] = [];
    const feedback: string[] = [];
    let score = 100;

    // Check for required keypoints
    const requiredPoints = ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'leftKnee', 'rightKnee'];
    const hasRequiredPoints = requiredPoints.every(point => keypoints[point]);

    if (!hasRequiredPoints) {
      return { 
        score: 0, 
        feedback: ['Position yourself so your full body is visible from the side'], 
        errors: ['Incomplete pose detection'] 
      };
    }

    const leftShoulder = keypoints.leftShoulder;
    const rightShoulder = keypoints.rightShoulder;
    const leftHip = keypoints.leftHip;
    const rightHip = keypoints.rightHip;
    const leftKnee = keypoints.leftKnee;
    const rightKnee = keypoints.rightKnee;

    // 1. Back Angle Analysis
    const shoulderCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
    };
    const hipCenter = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2,
    };

    const backAngle = Math.atan2(
      shoulderCenter.y - hipCenter.y,
      shoulderCenter.x - hipCenter.x
    ) * 180 / Math.PI;

    if (Math.abs(backAngle) > 30) {
      errors.push('Back rounding detected - keep your back straight');
      score -= 30;
    } else if (Math.abs(backAngle) > 15) {
      feedback.push('Slight back rounding - focus on neutral spine');
      score -= 10;
    } else {
      feedback.push('Good back position!');
    }

    // 2. Hip Hinge Analysis
    const kneeCenter = {
      x: (leftKnee.x + rightKnee.x) / 2,
      y: (leftKnee.y + rightKnee.y) / 2,
    };

    const hipToKneeDistance = Math.sqrt(
      Math.pow(hipCenter.x - kneeCenter.x, 2) + Math.pow(hipCenter.y - kneeCenter.y, 2)
    );

    if (hipToKneeDistance < 0.1) {
      errors.push('Not enough hip hinge - push your hips back');
      score -= 25;
    } else if (hipToKneeDistance < 0.15) {
      feedback.push('Good hip hinge, try to push hips back slightly more');
      score -= 5;
    } else {
      feedback.push('Excellent hip hinge pattern!');
    }

    // 3. Knee Position Check
    if (keypoints.leftAnkle && keypoints.rightAnkle) {
      const ankleCenter = {
        x: (keypoints.leftAnkle.x + keypoints.rightAnkle.x) / 2,
        y: (keypoints.leftAnkle.y + keypoints.rightAnkle.y) / 2,
      };

      const kneeOverToes = Math.abs(kneeCenter.x - ankleCenter.x);
      if (kneeOverToes > 0.08) {
        errors.push('Knees too far forward - keep shins more vertical');
        score -= 15;
      }
    }

    const repCompleted = this.detectDeadliftMovement(poseData);

    return {
      score: Math.max(0, score),
      feedback,
      errors,
      repCompleted,
      details: {
        backAngle: Math.abs(backAngle),
        hipHinge: hipToKneeDistance,
      }
    };
  }

  // Helper methods
  private static calculateAngle(point1: KeyPoint, point2: KeyPoint, point3: KeyPoint): number {
    const vector1 = {
      x: point1.x - point2.x,
      y: point1.y - point2.y,
    };
    const vector2 = {
      x: point3.x - point2.x,
      y: point3.y - point2.y,
    };

    const dot = vector1.x * vector2.x + vector1.y * vector2.y;
    const mag1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
    const mag2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);

    const cos = dot / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
  }

  private static detectBottomPosition(poseData: PoseData): boolean {
    const { keypoints } = poseData;
    const hipHeight = (keypoints.leftHip.y + keypoints.rightHip.y) / 2;
    const kneeHeight = (keypoints.leftKnee.y + keypoints.rightKnee.y) / 2;
    
    return hipHeight > kneeHeight; // Hips below knees
  }

  private static detectPressMovement(poseData: PoseData): boolean {
    // Simple heuristic for bench press rep detection
    return Math.random() > 0.8; // Placeholder
  }

  private static detectDeadliftMovement(poseData: PoseData): boolean {
    const { keypoints } = poseData;
    const hipCenter = {
      x: (keypoints.leftHip.x + keypoints.rightHip.x) / 2,
      y: (keypoints.leftHip.y + keypoints.rightHip.y) / 2,
    };
    const shoulderCenter = {
      x: (keypoints.leftShoulder.x + keypoints.rightShoulder.x) / 2,
      y: (keypoints.leftShoulder.y + keypoints.rightShoulder.y) / 2,
    };
    
    // Check if torso is upright (completing the lift)
    const torsoAngle = Math.abs(shoulderCenter.x - hipCenter.x);
    return torsoAngle < 0.05; // Standing upright
  }
}

export default FormAnalyzer;