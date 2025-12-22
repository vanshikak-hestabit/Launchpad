import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("src/data/raw/train.csv")

TARGET = "Survived"

# FEATURES CREATION

# 1. FAMILY SIZE
df["FamilySize"] = df["SibSp"] + df["Parch"] + 1

# 2. IS ALONE
df["IsAlone"] = (df["FamilySize"] == 1).astype(int)

# 3. FILL AGE
df["AgeFilled"] = df["Age"].fillna(df["Age"].median())

# 4. FILL FARE
df["FareFilled"] = df["Fare"].fillna(df["Fare"].median())

# 5. FARE PER PERSON
df["FarePerPerson"] = df["FareFilled"] / df["FamilySize"]

# 6. IS CHILD
df["IsChild"] = (df["AgeFilled"] < 16).astype(int)

# 7. IS FEMALE
df["IsFemale"] = (df["Sex"] == "female").astype(int)

# 8. FILL EMBARKED
df["EmbarkedFilled"] = df["Embarked"].fillna("Unknown")

# 9. EXTRACT TITLE FROM NAME
df["Title"] = df["Name"].str.extract(r" ([A-Za-z]+)\.", expand=False)

# 10. HAS CABIN
df["HasCabin"] = df["Cabin"].notna().astype(int)

print("Features created")


# ENCODING

# One-hot encoding for categorical columns
df = pd.get_dummies(
    df,
    columns=["EmbarkedFilled", "Title"],
    drop_first=True
)

# FEATURE MATRIX 

# Columns to use as input
FEATURE_COLS = [
    "FamilySize",
    "IsAlone",
    "AgeFilled",
    "FareFilled",
    "FarePerPerson",
    "IsChild",
    "IsFemale",
    "HasCabin",
] + [col for col in df.columns if col.startswith("EmbarkedFilled_") or col.startswith("Title_")]

X = df[FEATURE_COLS]
y = df[TARGET]

# SCALING (standardscaler)

scaler = StandardScaler()
X_scaled = pd.DataFrame(
    scaler.fit_transform(X),
    columns=X.columns
)


#  TRAIN TEST SPLIT
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

pd.to_pickle(X_train, "src/data/processed/X_train.pkl")
pd.to_pickle(X_test, "src/data/processed/X_test.pkl")
pd.to_pickle(y_train, "src/data/processed/y_train.pkl")
pd.to_pickle(y_test, "src/data/processed/y_test.pkl")

