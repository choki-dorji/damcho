import pickle
import pandas as pd

# Load the model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# Print model information
print("Model type:", type(model))
print("\nModel attributes:", dir(model))

# Try to get feature names if available
try:
    if hasattr(model, 'feature_names_in_'):
        print("\nRequired features:", model.feature_names_in_)
    elif hasattr(model, 'feature_names'):
        print("\nRequired features:", model.feature_names)
except:
    print("\nCould not automatically determine feature names")

# Print model parameters if available
try:
    print("\nModel parameters:", model.get_params())
except:
    print("\nCould not get model parameters") 