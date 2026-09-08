import * as Linking from 'expo-linking';
import config from '../../../config/emergency.json';
import { emergencyCallConfigSchema } from '../../domain/emergency';
import { openEmergencyDialer } from '../../application/emergency/emergencyCall';

export const emergencyCallConfig = emergencyCallConfigSchema.parse(config);
export const callEmergencyServices = () => openEmergencyDialer(emergencyCallConfig, Linking);
