import sqlite3
import random

def create_database():
    conn = sqlite3.connect("sales.db") # storing DB connection
    cursor = conn.cursor()             # var to talk to DB

    # delete old tables bcz we want new table evrytime
    cursor.executescript("""
    DROP TABLE IF EXISTS sales;
    DROP TABLE IF EXISTS albums;
    DROP TABLE IF EXISTS artists;
    DROP TABLE IF EXISTS countries;
    DROP TABLE IF EXISTS streams;
    """)

    # creating artist table
    cursor.execute("""
    CREATE TABLE artists (
        artist_id INTEGER PRIMARY KEY,
        name TEXT,
        genre TEXT
    )
    """)

    artists = [
        (1, "Adele", "Pop"),
        (2, "Drake", "Hip-Hop"),
        (3, "Taylor Swift", "Pop"),
        (4, "Ed Sheeran", "Pop"),
        (5, "The Weeknd", "R&B")
    ]

    cursor.executemany(
        "INSERT INTO artists VALUES (?, ?, ?)", artists
    )

    # create albums table
    cursor.execute("""
    CREATE TABLE albums (
        album_id INTEGER PRIMARY KEY,
        artist_id INTEGER,
        album_name TEXT,
        release_year INTEGER
    )
    """)

    albums = [
        (1, 1, "30", 2021),
        (2, 2, "Scorpion", 2018),
        (3, 3, "Midnights", 2022),
        (4, 4, "Divide", 2017),
        (5, 5, "After Hours", 2020)
    ]

    cursor.executemany(
        "INSERT INTO albums VALUES (?, ?, ?, ?)", albums
    )

    # country table
    cursor.execute("""
    CREATE TABLE countries (
        country_id INTEGER PRIMARY KEY,
        country_name TEXT
    )
    """)

    countries = [
        (1, "USA"),
        (2, "UK"),
        (3, "India"),
        (4, "Canada"),
        (5, "Australia")
    ]

    cursor.executemany(
        "INSERT INTO countries VALUES (?, ?)", countries
    )

    # sales table 
    cursor.execute("""
    CREATE TABLE sales (
        sale_id INTEGER PRIMARY KEY,
        artist_id INTEGER,
        amount INTEGER,
        year INTEGER,
        country_id INTEGER
    )
    """)

    sales_data = []
    sale_id = 1
    for _ in range(30):
        sales_data.append((
            sale_id,
            random.randint(1, 5),     # artist_id
            random.randint(1000, 70000),   # amt
            random.choice([2022, 2023, 2024]),  # random yr
            random.randint(1, 5)      # country_id
        ))
        sale_id += 1

    cursor.executemany(
        "INSERT INTO sales VALUES (?, ?, ?, ?, ?)", sales_data
    )

    # streams of artist's album table
    cursor.execute("""
    CREATE TABLE streams (
        stream_id INTEGER PRIMARY KEY,
        artist_id INTEGER,
        stream_count INTEGER,
        year INTEGER
    )
    """)

    streams_data = []
    for i in range(1, 21):
        streams_data.append((
            i,
            random.randint(1, 5),
            random.randint(1000000, 100000000), # 1M-100M
            random.choice([2022, 2023, 2024])
        ))

    cursor.executemany(
        "INSERT INTO streams VALUES (?, ?, ?, ?)", streams_data
    )

    conn.commit()
    conn.close()
    print("Database created with 5 tables and 50+ records")

if __name__ == "__main__":
    create_database()
