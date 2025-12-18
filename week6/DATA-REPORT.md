# Titanic Dataset - Data Report

## 1. Sataset Overview
- Rows: 891
- Columns: 11
- No missing values after cleaning
- Numeric columns: PassengerId, Survived, Pclass, Age, SibSp, Parch, Fare
- Categorical columns: Name, Sex, Ticket, Embarked

## 2. Data Cleaning
- Filled missing values in Age and Embarked
- Removed duplicates
- Handled outliers in Age and Fare


## 3. Exploratory Data Analysis (EDA)

### Correlation Matrix
- Correlation heatmap shows numeric features relationships
- Survived correlates positively with Pclass (inverse), Fare, and Age moderately

### Feature Distributions
- Age: roughly normal distribution
- Fare: right-skewed
- SibSp, Parch: mostly 0 or small integers
- Pclass: mostly 3

### Target Distribution
- Survived: 0 → 549, 1 → 342
- Slight class imbalance

### Missing Values
- Heatmap shows no missing values after cleaning