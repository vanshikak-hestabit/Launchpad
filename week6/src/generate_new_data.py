import pandas as pd
import numpy as np

# Load training data
X_train = pd.read_pickle("data/processed/X_train.pkl")

# Simulate new data
X_new = X_train.sample(10, random_state=42)  # take 10 random rows
X_new += np.random.normal(0, 0.05, X_new.shape)  # add small noise

# Save it as X_new.pkl
X_new.to_pickle("data/processed/X_new.pkl")
print("X_new.pkl created!")
