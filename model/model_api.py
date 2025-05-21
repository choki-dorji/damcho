from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS

# Setup logging
logging.basicConfig(level=logging.INFO)

# Load your ML model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
except Exception as e:
    app.logger.error(f"Error loading model: {str(e)}")
    raise

# If available, capture the expected feature order
expected_columns = getattr(model, "feature_names_in_", None)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.json
        if not input_data:
            return jsonify({'error': 'No input data provided'}), 400

        app.logger.info("Received data: %s", input_data)

        df = pd.DataFrame([input_data])

        # Define columns
        numeric_fields = [
            'Age', 'Care_Coordination_Score', 'Lifestyle_Change_Effort',
            'Fear_of_Recurrence_Score', 'Sleep_Disruption_Score', 'Cognitive_Function_Score'
        ]
        categorical_fields = [
            'Gender', 'Cancer_type', 'Treatment_type', 'Smoking_status', 'Alcohol_use', 'Sleep_quality',
            'Excercise_frequently', 'Diet_quality', 'Activity_level', 'Social_support', 'Fatigue', 'Nausea',
            'Pain', 'Skin_changes', 'Respiratory_issues', 'Emotional_distress', 'Other_symptoms',
            'No_significant_issues', 'Anxiety', 'Depression', 'Stress', 'Risk_Stratification', 'Coping_Style',
            'PTSD_Flag', 'Fertility_Concern', 'Cardiovascular_Risk', 'Late_Effect_Symptoms'
        ]

        # Convert numeric
        for col in numeric_fields:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

        # Normalize and convert categoricals
        for col in categorical_fields:
            if col in df.columns:
                df[col] = df[col].astype(str).str.strip().str.lower().astype('category')

        # Handle missing columns
        all_fields = numeric_fields + categorical_fields
        for col in all_fields:
            if col not in df.columns:
                df[col] = pd.NA
        df = df[all_fields]

        # Align column order if model has recorded it
        if expected_columns is not None:
            for col in expected_columns:
                if col not in df.columns:
                    df[col] = pd.NA
            df = df[expected_columns]

        # Prediction
        prediction = model.predict(df)

        try:
            proba = model.predict_proba(df)
            return jsonify({
                'care_plan': int(prediction[0]),
                'confidence': float(np.max(proba[0])),
                'status': 'success'
            })
        except:
            return jsonify({
                'care_plan': int(prediction[0]),
                'status': 'success'
            })

    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e), 'status': 'error'}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
