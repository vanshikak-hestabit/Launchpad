# DAY 3 — Model Building & Comparison

## Objective
Build and compare multiple machine learning models on the Titanic dataset
and automatically select the best-performing model.

Target variable: `Survived`

---

## Models Used
- Logistic Regression
- Random Forest Classifier
- XGBoost Classifier

These models were chosen to compare:
- Linear vs tree-based approaches
- Simple vs advanced models

---

## Training Strategy
- Training data was generated from the feature engineering pipeline (Day 2)
- 5-fold cross-validation was applied to each model
- This prevents overfitting and ensures stable evaluation

---

## Evaluation Metrics
Each model was evaluated using:
- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

ROC-AUC was used as the primary metric for selecting the best model.

---

## Model Selection
- Cross-validation results were compared automatically
- Logistic Regression achieved the highest ROC-AUC score
- Logistic Regression was selected as the final model

---

## Outputs Generated

- Best model saved at: src/models/best_model.pkl
- Cross-validation metrics saved at: src/evaluation/metrics.json
- Confusion matrix generated using: src/evaluation/confusion_matrix.py
