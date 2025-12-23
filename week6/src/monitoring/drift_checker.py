
import pandas as pd
from scipy.stats import ks_2samp
import json
import os

# Paths
TRAIN_DATA_PATH = "./data/processed/X_train.pkl"
NEW_DATA_PATH = "./data/processed/X_new.pkl"  
DRIFT_REPORT_PATH = "./monitoring/drift_report.json"

# Load data
X_train = pd.read_pickle(TRAIN_DATA_PATH)
X_new = pd.read_pickle(NEW_DATA_PATH)

drift_results = {}

# Check drift feature-wise
for col in X_train.columns:
    stat, p_value = ks_2samp(X_train[col], X_new[col])
    drift_results[col] = {
        "statistic": stat,
        "p_value": p_value,
        "drift_detected": p_value < 0.05
    }

# Save drift report
os.makedirs(os.path.dirname(DRIFT_REPORT_PATH), exist_ok=True)
with open("./monitoring/drift_report.json", "w") as f:
    json.dump(drift_results, f, indent=4, default=lambda x: bool(x))


print("Drift check complete. Report saved to", DRIFT_REPORT_PATH)
