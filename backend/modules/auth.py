from fastapi import APIRouter, Depends, HTTPException
from utils.auth import get_current_user
from utils.supabase import supabase
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    access_token: str

@router.post("/login")
async def login(request: LoginRequest):
    """
    This endpoint can be used to verify a token from the frontend
    and potentially store user info in a custom users table.
    """
    try:
        user_response = supabase.auth.get_user(request.access_token)
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = user_response.user
        
        # Upsert user into public.users table
        # We'll use service role or just the client if permissions allow
        # Assuming a 'users' table exists with columns: id, email, full_name, avatar_url
        user_data = {
            "id": user.id,
            "email": user.email,
            "full_name": user.user_metadata.get("full_name"),
            "avatar_url": user.user_metadata.get("avatar_url"),
        }
        
        supabase.table("users").upsert(user_data).execute()
        
        return {"status": "success", "user": user_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout():
    # Supabase logout is mostly client-side (clearing tokens)
    # But we can provide an endpoint if needed
    return {"status": "success", "message": "Logged out successfully"}

@router.get("/me")
async def get_me(user = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.user_metadata.get("full_name"),
        "avatar_url": user.user_metadata.get("avatar_url"),
    }
