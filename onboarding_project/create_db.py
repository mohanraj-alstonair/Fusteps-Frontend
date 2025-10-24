#!/usr/bin/env python3
import mysql.connector
from mysql.connector import Error

def create_database():
    try:
        # Connect to MySQL server (without specifying database)
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=''  # XAMPP default empty password
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create database if it doesn't exist
            cursor.execute("CREATE DATABASE IF NOT EXISTS registered_student")
            print("Database 'registered_student' created successfully!")
            
            # Show databases to confirm
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            print("\nAvailable databases:")
            for db in databases:
                print(f"- {db[0]}")
                
    except Error as e:
        print(f"Error: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure XAMPP MySQL is running")
        print("2. Check if the password is correct (try empty password)")
        print("3. Try accessing phpMyAdmin at http://localhost/phpmyadmin")
        
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    create_database()