import { DatasetRow, RiskLevel, TelemetryData } from '../types';

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function determineRisk(data: TelemetryData): RiskLevel {
  let riskScore = 0;

  // Base Risk from Speed & G-Force
  // High speed + High Lat G = Danger
  riskScore += (data.speed_kmh / 200) * 40; 
  riskScore += (Math.abs(data.lateral_g) / 1.5) * 50;

  // Steering impact (sharp turns at speed)
  riskScore += (Math.abs(data.steering_angle_deg) / 180) * 20;

  // Braking in corner (Lift-off oversteer or simple loss of traction)
  if (data.longitudinal_g < -0.4 && Math.abs(data.lateral_g) > 0.3) {
    riskScore += 25;
  }

  // Tire Temps (Goldilocks zone ~30-90)
  if (data.tire_temp_c < 20) riskScore += 15; // Cold tires
  if (data.tire_temp_c > 100) riskScore += 15; // Overheating

  // Systems intervention is a huge red flag
  if (data.esp_active) riskScore += 40;
  if (data.tc_active) riskScore += 30;

  if (riskScore < 45) return 'Low';
  if (riskScore < 75) return 'Medium';
  return 'High';
}

export const generateDataset = (count: number): DatasetRow[] => {
  const rows: DatasetRow[] = [];

  for (let i = 0; i < count; i++) {
    // Randomize Scenario
    const scenario = Math.random();
    
    let speed = 0;
    let latG = 0;
    let steer = 0;

    if (scenario < 0.33) {
      // City (Low speed, sharp turns)
      speed = 20 + Math.random() * 40;
      latG = Math.random() * 0.6;
      steer = Math.random() * 180 * (Math.random() > 0.5 ? 1 : -1);
    } else if (scenario < 0.66) {
      // Highway (High speed, low steer, low-med lat G)
      speed = 90 + Math.random() * 60;
      latG = Math.random() * 0.4;
      steer = Math.random() * 30 * (Math.random() > 0.5 ? 1 : -1);
    } else {
      // Country/Sport (Med-High speed, High lat G)
      speed = 60 + Math.random() * 80;
      latG = Math.random() * 1.2;
      steer = Math.random() * 100 * (Math.random() > 0.5 ? 1 : -1);
    }

    // Correlate Lat G with Steering and Speed Physics roughly
    // F = mv^2/r -> LatG ~ speed^2 * steer
    // We add noise to make it "measured" data
    const calculatedLatG = (Math.pow(speed / 100, 2) * (Math.abs(steer) / 20)) + (Math.random() * 0.2 - 0.1);
    
    // Smooth blending of randomized vs calculated for realism
    const finalLatG = clamp((latG + calculatedLatG) / 2, 0, 1.4) * (steer > 0 ? 1 : -1); 

    const row: TelemetryData = {
      speed_kmh: Number(speed.toFixed(1)),
      lateral_g: Number(finalLatG.toFixed(2)),
      longitudinal_g: Number((Math.random() * 0.8 - 0.4).toFixed(2)), // Mostly cruising/mild accel/brake
      steering_angle_deg: Number(steer.toFixed(1)),
      road_incline_deg: Number((Math.random() * 20 - 10).toFixed(1)),
      tire_temp_c: Number((10 + Math.random() * 100).toFixed(1)),
      esp_active: 0,
      tc_active: 0
    };

    // Post-process logic for consistency
    // Hard braking
    if (Math.random() < 0.1) row.longitudinal_g = -0.6 - Math.random() * 0.4;

    // ESP Logic: Active if LatG is high and Steer is high (instability)
    if (Math.abs(row.lateral_g) > 0.8 && Math.random() > 0.4) row.esp_active = 1;
    
    // TC Logic: Active if LongG is high (accel) and speed is low (wheelspin)
    if (row.longitudinal_g > 0.3 && row.speed_kmh < 40 && Math.random() > 0.6) row.tc_active = 1;

    const risk = determineRisk(row);
    rows.push({ ...row, risk_level: risk });
  }

  return rows;
};

export const convertToCSV = (data: DatasetRow[]): string => {
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  return [header, ...rows].join('\n');
};