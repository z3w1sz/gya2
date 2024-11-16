def transform_user(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
    }
