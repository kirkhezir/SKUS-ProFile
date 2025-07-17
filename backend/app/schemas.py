from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MemberBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    role: Optional[str]
    join_date: Optional[datetime]

class MemberCreate(MemberBase):
    pass

class MemberUpdate(MemberBase):
    pass

class MemberOut(MemberBase):
    id: int
    image_url: Optional[str]

    class Config:
        orm_mode = True
