import psycopg2

DB_CONFIG = {
    "database": "db_jman",
    "user": "jman",
    "password": "jman_pass",
    "host": "pathway-4.ca1yc8okmo57.us-east-1.rds.amazonaws.com",
    "port": "5432"
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0
    );
    """)

    conn.commit()
    cursor.close()
    conn.close()
