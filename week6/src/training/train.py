import pandas as pd
import json
import joblib
from sklearn.model_selection import cross_validate
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.neural_network import MLPClassifier


# ---------------- LOAD DATA ----------------
X_train = pd.read_pickle("src/data/processed/X_train.pkl")
y_train = pd.read_pickle("src/data/processed/y_train.pkl")

# ---------------- MODELS ----------------
models = {
    "LogisticRegression": LogisticRegression(max_iter=1000),
    "RandomForest": RandomForestClassifier(random_state=42),
    "XGBoost": XGBClassifier(
        random_state=42,
        eval_metric="logloss"
    ),
    "NeuralNetwork": MLPClassifier(
        hidden_layer_sizes=(64, 32),
        max_iter=500,
        random_state=42
    )
}

scoring = ["accuracy", "precision", "recall", "f1", "roc_auc"]
results = {}

# ---------------- TRAIN + CV ----------------
for name, model in models.items():
    scores = cross_validate(
        model,
        X_train,
        y_train,
        cv=5,
        scoring=scoring
    )

    results[name] = {
        "accuracy": scores["test_accuracy"].mean(),
        "precision": scores["test_precision"].mean(),
        "recall": scores["test_recall"].mean(),
        "f1": scores["test_f1"].mean(),
        "roc_auc": scores["test_roc_auc"].mean()
    }

# ---------------- SELECT BEST MODEL ----------------
best_model_name = max(results, key=lambda x: results[x]["roc_auc"])
best_model = models[best_model_name]

# Train best model on full training data
best_model.fit(X_train, y_train)

# ---------------- SAVE OUTPUTS ----------------
with open("src/evaluation/metrics.json", "w") as f:
    json.dump(results, f, indent=4)

joblib.dump(best_model, "src/models/best_model.pkl")

print("Best model:", best_model_name)
print("Model and metrics saved")


# ready-to-run pipeline that:
# Loads your prepared features
# Trains 3 models with cross-validation
# Calculates metrics for each
# Picks the best model automatically
# Saves everything for later use