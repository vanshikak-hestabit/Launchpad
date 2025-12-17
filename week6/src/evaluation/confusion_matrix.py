import pandas as pd
import joblib
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

# Load data
X_test = pd.read_pickle("src/data/processed/X_test.pkl")
y_test = pd.read_pickle("src/data/processed/y_test.pkl")

# Load best model
model = joblib.load("src/models/best_model.pkl")

# Predictions
y_pred = model.predict(X_test)

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot()
plt.title("Confusion Matrix")
plt.show()

print("Confusion matrix plotted")
