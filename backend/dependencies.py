from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    """
    Validates the Bearer token (which we pass as the Google Email from NextAuth)
    and gets or creates the corresponding user in our PostgreSQL DB.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: No valid Bearer token provided.")
    
    # In this NextAuth pattern, the frontend sends `Bearer <email>`
    email = authorization.split(" ")[1]
    
    if not email:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid token format.")

    user = db.query(User).filter(User.username == email).first()
    
    if not user:
        # Auto-provision a new user vault
        user = User(username=email, is_active=True)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user.id
