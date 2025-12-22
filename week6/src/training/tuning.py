import pandas as pd
import json
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV

# LOAD DATA 
X_train = pd.read_pickle("src/data/processed/X_train.pkl")
y_train = pd.read_pickle("src/data/processed/y_train.pkl")

#  MODEL
log_reg = LogisticRegression(max_iter=1000)

# PARAMETER GRID 
my_settings = {
    "C": [0.01, 0.1, 1, 10],
    "penalty": ["l2"],
    "solver": ["lbfgs"]
}

#  GRID SEARCH (training+testing+comparing)
grid_search = GridSearchCV(
    estimator=log_reg,
    param_grid=my_settings,
    scoring="roc_auc",
    cv=5,
    n_jobs=-1
)

grid_search.fit(X_train, y_train)

# RESULTS 
best_params = grid_search.best_params_
best_score = grid_search.best_score_

results = {
    "model": "LogisticRegression",
    "best_params": best_params,
    "best_roc_auc": best_score
}

# SAVE RESULTS in JSON
with open("src/tuning/results.json", "w") as f:
    json.dump(results, f, indent=4)

print("Best Parameters:", best_params)
print("Best ROC-AUC:", best_score)
