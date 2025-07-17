from sqlalchemy.orm import Session
from app.db import models
from app.schemas import MemberCreate, MemberUpdate

def create_member(db: Session, member: MemberCreate):
    db_member = models.Member(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def get_members(db: Session):
    return db.query(models.Member).filter_by(is_deleted=False).all()

def get_member(db: Session, member_id: int):
    return db.query(models.Member).filter_by(id=member_id, is_deleted=False).first()

def update_member(db: Session, member_id: int, member: MemberUpdate):
    db_member = get_member(db, member_id)
    for key, value in member.dict(exclude_unset=True).items():
        setattr(db_member, key, value)
    db.commit()
    db.refresh(db_member)
    return db_member

def soft_delete_member(db: Session, member_id: int):
    db_member = get_member(db, member_id)
    db_member.is_deleted = True
    db.commit()
    return {"status": "deleted"}
