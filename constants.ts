export const PYTHON_SCRIPT_CONTENT = `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# 1. Load the dataset
print("Loading dataset...")
try:
    df = pd.read_csv('cornering_data.csv')
except FileNotFoundError:
    print("Error: cornering_data.csv not found. Please generate and download it first.")
    exit()

# 2. Preprocessing
# Encode target variable 'risk_level'
# Mapping: Low -> 0, Medium -> 1, High -> 2 for internal logic, 
# but sklearn can handle string labels automatically. 
# We will keep it simple and let the classifier handle string labels or encode them.
X = df.drop('risk_level', axis=1)
y = df['risk_level']

# 3. Split Data
print("Splitting data into training and test sets...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. Initialize and Train Model
# Using Random Forest as a robust baseline for tabular data
print("Training Random Forest Classifier...")
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)
rf_model.fit(X_train, y_train)

# 5. Evaluation
print("Evaluating model...")
y_pred = rf_model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"\\nTest Set Accuracy: {accuracy:.2f}")

print("\\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# 6. Save Model
print("\\nSaving model to 'cornering_risk_model.pkl'...")
joblib.dump(rf_model, 'cornering_risk_model.pkl')
print("Done!")
`;

export const README_CONTENT = `# AI Cornering Risk Advisor

## 1. Project Overview
The **AI Cornering Risk Advisor** is a machine learning project designed to estimate the safety risk of a vehicle during cornering maneuvers. By analyzing vehicle dynamics signals in real-time, the system classifies the current situation into one of three risk levels: **Low**, **Medium**, or **High**.

## 2. Motivation
Cornering is one of the most critical maneuvers in driving. Loss of control often occurs due to excessive speed, poor tire conditions, or aggressive steering inputs relative to the road surface.
- **Safety**: Early detection of high-risk states can trigger driver warnings or autonomous interventions (ESP/TC).
- **Performance**: In motorsports, understanding the limit of adhesion is key to optimal lap times.

## 3. Dataset
The project uses a **synthetic but realistic dataset** (\`cornering_data.csv\`) representing various driving scenarios (City, Country, Highway).

### Features
- \`speed_kmh\`: Vehicle speed in km/h.
- \`lateral_g\`: Lateral acceleration (m/s² or g-force). Higher values indicate harder cornering.
- \`longitudinal_g\`: Acceleration (positive) or braking (negative).
- \`steering_angle_deg\`: Steering wheel angle.
- \`road_incline_deg\`: Slope of the road.
- \`tire_temp_c\`: Tire surface temperature.
- \`esp_active\`: 1 if Electronic Stability Program is active, 0 otherwise.
- \`tc_active\`: 1 if Traction Control is active, 0 otherwise.

### Target
- \`risk_level\`: **Low**, **Medium**, **High**.

## 4. Modeling Approach
- **Data Split**: Standard 80/20 train/test split.
- **Algorithm**: Random Forest Classifier. Chosen for its robustness to non-linear relationships and lack of need for heavy feature scaling.
- **Evaluation**: Accuracy, Precision, Recall, and F1-Score.

## 5. Results
*Note: Results depend on the generated synthetic data.*
- **Typical Accuracy**: > 90%
- **Confusion Matrix**: Shows good separation between Low and High risk, with some overlap in the Medium category.

## 6. How to Run
1. **Setup Environment**:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # or venv\\Scripts\\activate on Windows
   pip install pandas scikit-learn joblib
   \`\`\`
2. **Prepare Data**:
   - Place \`cornering_data.csv\` in the project root.
3. **Train Model**:
   \`\`\`bash
   python train_model.py
   \`\`\`
4. **Output**:
   - The script prints evaluation metrics to the console.
   - The trained model is saved as \`cornering_risk_model.pkl\`.

## 7. Future Work
- Integrate real-world CAN bus data.
- Add friction coefficient estimation (wet/dry/snow).
- Implement a time-series model (LSTM) to predict risk *before* the corner apex.

## 8. Disclaimer
This is an educational project using synthetic data. It is **not** a safety-critical system and should not be used for real-world vehicle control without rigorous validation.
`;
