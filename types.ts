// Fix: Import React to resolve "Cannot find namespace 'React'" error.
import React from 'react';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface TelemetryData {
  speed_kmh: number;
  lateral_g: number;
  longitudinal_g: number;
  steering_angle_deg: number;
  road_incline_deg: number;
  tire_temp_c: number;
  esp_active: 0 | 1;
  tc_active: 0 | 1;
}

export interface DatasetRow extends TelemetryData {
  risk_level: RiskLevel;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}