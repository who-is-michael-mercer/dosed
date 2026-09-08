import type { EmergencyCallConfig } from '../../domain/emergency';
export interface Dialer {
  canOpenURL(url: string): Promise<boolean>;
  openURL(url: string): Promise<unknown>;
}

export async function openEmergencyDialer(
  emergencyCallConfig: EmergencyCallConfig,
  dialer: Dialer,
): Promise<'opened' | 'unavailable'> {
  const url = `${emergencyCallConfig.dialerScheme}:${emergencyCallConfig.number}`;
  try {
    if (!(await dialer.canOpenURL(url))) return 'unavailable';
    await dialer.openURL(url);
    return 'opened';
  } catch {
    return 'unavailable';
  }
}
