from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db import models, database
from app.schemas import MemberCreate, MemberUpdate
from app.services import crud
import shutil

app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/members/")
def create_member(member: MemberCreate, db: Session = Depends(database.get_db)):
    return crud.create_member(db, member)

@app.get("/api/members/")
def list_members(db: Session = Depends(database.get_db)):
    return crud.get_members(db)

@app.get("/api/members/{member_id}")
def get_member(member_id: int, db: Session = Depends(database.get_db)):
    return crud.get_member(db, member_id)

@app.put("/api/members/{member_id}")
def update_member(member_id: int, member: MemberUpdate, db: Session = Depends(database.get_db)):
    return crud.update_member(db, member_id, member)

@app.delete("/api/members/{member_id}")
def delete_member(member_id: int, db: Session = Depends(database.get_db)):
    return crud.soft_delete_member(db, member_id)

@app.post("/api/members/{member_id}/upload")
def upload_image(member_id: int, file: UploadFile = File(...)):
    filepath = f"static/images/{member_id}.png"
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": filepath}
