from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import json
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow the React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to your JSON file
USER_DATA_PATH = "D:\\Projects\\React-Websites\\leaf\\leaf\\public\\allowedUsers.json"

# Data model for a user
class User(BaseModel):
    email: str
    password: str
    isAdmin: bool = False
    isEditor: bool = False

# Load users from JSON file
def load_users():
    if not os.path.exists(USER_DATA_PATH):
        return []
    with open(USER_DATA_PATH, "r") as file:
        return json.load(file)

# Save users to JSON file
def save_users(users):
    with open(USER_DATA_PATH, "w") as file:
        json.dump(users, file, indent=4)

# GET endpoint to fetch all users
@app.get("/users", response_model=List[User])
def get_users():
    return load_users()

# POST endpoint to add a new user
@app.post("/addUser", response_model=User)
def add_user(new_user: User):
    users = load_users()
    # Check if the user already exists
    if any(user["email"] == new_user.email for user in users):
        raise HTTPException(status_code=400, detail="User already exists")

    users.append(new_user.dict())  # Add the new user to the list
    save_users(users)  # Save the updated user list
    return new_user  # Return the added user

# POST endpoint to update the user list
@app.post("/updateUsers")
def update_users(updated_users: List[User]):
    try:
        save_users([user.dict() for user in updated_users])
        return {"message": "User list updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE endpoint to remove a user by email
@app.delete("/deleteUser/{email}")
def delete_user(email: str):
    users = load_users()
    user_exists = any(user["email"] == email for user in users)

    if not user_exists:
        raise HTTPException(status_code=404, detail="User not found")

    # Remove user with matching email
    updated_users = [user for user in users if user["email"] != email]
    
    # Save updated user list
    save_users(updated_users)
    return {"message": f"User with email {email} deleted successfully"}
