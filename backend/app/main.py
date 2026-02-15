import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import schemas, crud
from .auth import create_access_token
from .deps import get_current_user

app = FastAPI(title="Vet Clinic API")

cors = os.getenv("CORS_ORIGINS", "*")
origins = [o.strip() for o in cors.split(",")] if cors != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

# MVP: create tables at boot
Base.metadata.create_all(bind=engine)

@app.post("/auth/signup", response_model=schemas.UserOut)
def signup(payload: schemas.SignupIn, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, payload.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, payload)

@app.post("/auth/login", response_model=schemas.TokenOut)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    user = crud.authenticate(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.email)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/owners", response_model=list[schemas.OwnerOut])
def owners_list(db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.list_owners(db)

@app.post("/owners", response_model=schemas.OwnerOut)
def owners_create(payload: schemas.OwnerCreate, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.create_owner(db, payload)

@app.get("/pets", response_model=list[schemas.PetOut])
def pets_list(db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.list_pets(db)

@app.post("/pets", response_model=schemas.PetOut)
def pets_create(payload: schemas.PetCreate, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.create_pet(db, payload)

@app.get("/appointments", response_model=list[schemas.AppointmentOut])
def appointments_list(db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.list_appointments(db)

@app.post("/appointments", response_model=schemas.AppointmentOut)
def appointments_create(payload: schemas.AppointmentCreate, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.create_appointment(db, payload)

@app.get("/consultations", response_model=list[schemas.ConsultationOut])
def consultations_list(db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.list_consultations(db)

@app.post("/consultations", response_model=schemas.ConsultationOut)
def consultations_create(payload: schemas.ConsultationCreate, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.create_consultation(db, payload)

@app.get("/invoices", response_model=list[schemas.InvoiceOut])
def invoices_list(db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.list_invoices(db)

@app.post("/invoices", response_model=schemas.InvoiceOut)
def invoices_create(payload: schemas.InvoiceCreate, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return crud.create_invoice(db, payload)
