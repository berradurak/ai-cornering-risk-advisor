# AI Cornering Risk Advisor

## 1. Project Overview
The **AI Cornering Risk Advisor** is a machine learning project designed to estimate the safety risk of a vehicle during cornering maneuvers. By analyzing vehicle dynamics signals in real-time, the system classifies the current situation into one of three risk levels: **Low**, **Medium**, or **High**.

## 2. Motivation
Cornering is one of the most critical maneuvers in driving. Loss of control often occurs due to excessive speed, poor tire conditions, or aggressive steering inputs relative to the road surface.
- **Safety**: Early detection of high-risk states can trigger driver warnings or autonomous interventions (ESP/TC).
- **Performance**: In motorsports, understanding the limit of adhesion is key to optimal lap times.

## 3. Dataset
The project uses a **synthetic but realistic dataset** (`cornering_data.csv`) representing various driving scenarios (City, Country, Highway).

### Features
- `speed_kmh`: Vehicle speed in km/h.
- `lateral_g`: Lateral acceleration (m/s² or g-force). Higher values indicate harder cornering.
- `longitudinal_g`: Acceleration (positive) or braking (negative).
- `steering_angle_deg`: Steering wheel angle.
- `road_incline_deg`: Slope of the road.
- `tire_temp_c`: Tire surface temperature.
- `esp_active`: 1 if Electronic Stability Program is active, 0 otherwise.
- `tc_active`: 1 if Traction Control is active, 0 otherwise.

### Target
- `risk_level`: **Low**, **Medium**, **High**.

## 4. Modeling Approach
- **Data Split**: Standard 80/20 train/test split.
- **Algorithm**: Random Forest Classifier. Chosen for its robustness to non-linear relationships and lack of need for heavy feature scaling.
- **Evaluation**: Accuracy, Precision, Recall, and F1-Score.

## 5. Results
*Note: Results depend on the generated synthetic data.*
- **Typical Accuracy**: > 90%
- **Confusion Matrix**: Shows good separation between Low and High risk, with some overlap in the Medium category.
