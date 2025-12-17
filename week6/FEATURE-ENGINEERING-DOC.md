# Feature Engineering & Feature Selection

## Dataset
- Dataset: Titanic (Kaggle)
- Target Variable: Survived

## Feature Engineering

### Numerical Features
- AgeFilled (missing values filled with median)
- FareFilled (missing values filled with median)
- FarePerPerson
- FamilySize

### Binary Features
- IsAlone
- IsChild
- IsFemale
- HasCabin

### Categorical Features
- EmbarkedFilled (one-hot encoded)
- Title (extracted from Name and one-hot encoded)

### Total Features Generated
- 10+ engineered features created from raw data

## Preprocessing
- Missing values handled using median or constant values
- One-hot encoding for categorical variables
- StandardScaler used for numerical feature normalization

## Feature Selection
- RandomForestClassifier used to compute feature importance
- Top features selected based on importance scores
- Selected feature list saved to `feature_list.json`

## Outputs
- X_train, X_test, y_train, y_test
- Feature importance visualization
- Selected feature list JSON