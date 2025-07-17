from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    address = Column(String)
    role = Column(String)
    join_date = Column(DateTime, default=datetime.utcnow)
    image_url = Column(String, default="/static/default-avatar.png")
    is_deleted = Column(Boolean, default=False)
