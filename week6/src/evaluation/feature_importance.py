import pandas as pd
import joblib
import matplotlib.pyplot as plt

# ---------------- LOAD DATA ----------------
X_train = pd.read_pickle("src/data/processed/X_train.pkl")

# ---------------- LOAD MODEL ----------------
model = joblib.load("src/models/best_model.pkl")

# ---------------- FEATURE IMPORTANCE ----------------
importance = model.coef_[0]
features = X_train.columns

fi_df = pd.DataFrame({
    "feature": features,
    "importance": importance
})

# sort by absolute importance
fi_df["abs_importance"] = fi_df["importance"].abs()
fi_df = fi_df.sort_values("abs_importance", ascending=False)

# ---------------- PLOT ----------------
plt.figure()
plt.barh(fi_df["feature"][:10], fi_df["importance"][:10])
plt.gca().invert_yaxis()
plt.title("Top 10 Feature Importances (Logistic Regression)")
plt.xlabel("Coefficient Value")
plt.tight_layout()
plt.show()
