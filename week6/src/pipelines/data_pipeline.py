import pandas as pd
from pathlib import Path

RAW_DATA_PATH = Path("data/raw")

def load_data(filename: str) -> pd.DataFrame:
    df = pd.read_csv(RAW_DATA_PATH / filename)
    return df


def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    print("Missing values before:")
    print(df.isnull().sum())

    # Fill Age with median
    df["Age"] = df["Age"].fillna(df["Age"].median())

    # Fill Embarked with most frequent value
    df["Embarked"] = df["Embarked"].fillna(df["Embarked"].mode()[0])

    # Drop Cabin (because too many missing)
    df = df.drop(columns=["Cabin"])

    print("\nMissing values after:")
    print(df.isnull().sum())

    return df

def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    before = df.shape[0]
    df = df.drop_duplicates()
    after = df.shape[0]

    print(f"\nDuplicates removed: {before - after}")
    return df

def handle_outliers(df: pd.DataFrame, column: str) -> pd.DataFrame:
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1

    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR

    outliers = df[(df[column] < lower) | (df[column] > upper)].shape[0]
    print(f"\nOutliers in {column}: {outliers}")

    df[column] = df[column].clip(lower, upper)
    return df

def save_processed_data(df: pd.DataFrame, filename: str = "final.csv"):
    output_path = Path("data/processed") / filename
    df.to_csv(output_path, index=False)
    print(f"\nCleaned data saved to {output_path}")


if __name__ == "__main__":
    df = load_data("train.csv")
    df = handle_missing_values(df)
    df = remove_duplicates(df)
    df = handle_outliers(df, "Age")
    df = handle_outliers(df, "Fare")
    save_processed_data(df)
    print(df.head())

# this script loadsraw data, cleans it, handles missing 
# values, outliers, duplicates and saves a processed CSV