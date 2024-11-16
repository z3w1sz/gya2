from pymongo import MongoClient
from os import getenv
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB Atlas
db_client = MongoClient(getenv("DATABASE_URL"))

# Create the respective database
user_database = db_client.users
products_database = db_client.accessories

# Create a collection for to use
user_collection = user_database.users
products_collection = products_database.accessories
categories_collection = products_database.categories
