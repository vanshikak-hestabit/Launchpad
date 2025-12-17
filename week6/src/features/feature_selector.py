import pandas as pd
import json
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier

# Load processed data
X_train = pd.read_pickle("src/data/processed/X_train.pkl")
y_train = pd.read_pickle("src/data/processed/y_train.pkl")

# Train simple model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Get feature importance
importance = model.feature_importances_

feature_importance_df = pd.DataFrame({
    "feature": X_train.columns,
    "importance": importance
}).sort_values(by="importance", ascending=False)

# Plot importance
plt.figure()
plt.barh(
    feature_importance_df["feature"],
    feature_importance_df["importance"]
)
plt.xlabel("Importance")
plt.ylabel("Feature")
plt.title("Feature Importance")
plt.show()

# Select top features
selected_features = feature_importance_df["feature"].head(15).tolist()

# Save feature list
with open ("src/features/features_list.json", "w") as f:
    json.dump(selected_features, f, indent=4)


