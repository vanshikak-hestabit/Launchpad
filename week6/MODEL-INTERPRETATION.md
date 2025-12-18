# Model Interpretation – Titanic Survival Prediction

## Selected Model
Logistic Regression was selected as the best-performing model based on cross-validation metrics. Hyperparameter tuning was then applied to further improve its ROC-AUC.

## Feature Importance
- Positive contributors to survival:
  - IsFemale
  - Title_Mrs
  - HasCabin
- Negative contributors to survival:
  - Title_Mr
  - Title_Rev
  - Being alone

These coefficients indicate how each feature affects survival probability.

## SHAP Analysis
SHAP values were used to explain individual predictions.
Top contributing features:
- IsFemale
- FamilySize
- Title_Mrs

SHAP shows how much each feature pushes a prediction toward survival or death.

## Error Analysis
Out of 179 test samples:
- Correct predictions: 146
- False Negatives: 18 (survived but predicted dead)
- False Positives: 15 (died but predicted survived)

The model slightly favors predicting death, which matches the dataset distribution.

## Conclusion
The Logistic Regression model performs well, is not overfitting,
and provides clear, interpretable explanations for its predictions.
