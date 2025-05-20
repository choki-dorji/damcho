from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your ML model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise

print("Classes:", model.classes_)
print("Number of classes:", len(model.classes_))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.json
        if not input_data:
            return jsonify({'error': 'No input data provided'}), 400

        # Convert input data to DataFrame
        df = pd.DataFrame([input_data])
        
        # Convert numeric columns to the correct type
        numeric_fields = [
            'Age', 'Care_Coordination_Score', 'Lifestyle_Change_Effort',
            'Fear_of_Recurrence_Score', 'Sleep_Disruption_Score', 'Cognitive_Function_Score'
        ]
        for col in numeric_fields:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

        # Convert categorical columns to category dtype
        categorical_fields = [
            'Gender', 'Cancer_type', 'Treatment_type', 'Smoking_status', 'Alcohol_use', 'Sleep_quality',
            'Excercise_frequently', 'Diet_quality', 'Activity_level', 'Social_support', 'Fatigue', 'Nausea',
            'Pain', 'Skin_changes', 'Respiratory_issues', 'Emotional_distress', 'Other_symptoms',
            'No_significant_issues', 'Anxiety', 'Depression', 'Stress', 'Risk_Stratification', 'Coping_Style',
            'PTSD_Flag', 'Fertility_Concern', 'Cardiovascular_Risk', 'Late_Effect_Symptoms'
        ]
        for col in categorical_fields:
            if col in df.columns:
                df[col] = df[col].astype('category')

        # Make prediction
        prediction = model.predict(df)
        
        # Get prediction probabilities if available
        try:
            probabilities = model.predict_proba(df)
            return jsonify({
                'care_plan': int(prediction[0]),
                'confidence': float(np.max(probabilities[0])),
                'status': 'success'
            })
        except:
            return jsonify({
                'care_plan': int(prediction[0]),
                'status': 'success'
            })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
