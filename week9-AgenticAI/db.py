import sqlite3

# Connect (or create) the database
conn = sqlite3.connect("user_data.db")
cursor = conn.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL
)
""")

# Insert 10 sample products
products = [
    ("laptop", 5, 75000.0),
    ("mouse", 20, 500.0),
    ("keyboard", 15, 1200.0),
    ("monitor", 7, 15000.0),
    ("printer", 3, 12000.0),
    ("hard disc", 10, 35000.0),
    ("cpu", 50, 1500.0),
    ("webcam", 8, 2500.0),
    ("headphones", 12, 1800.0),
    ("speaker", 6, 5000.0)
]

cursor.executemany("INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)", products)

# Commit and close
conn.commit()
conn.close()

print("Products database created with 10 items!")
