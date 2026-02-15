from sqlalchemy.orm import Session
from . import models, schemas
from .auth import hash_password, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, data: schemas.SignupIn):
    user = models.User(
        email=data.email,
        full_name=data.full_name,
        role=data.role,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def list_owners(db: Session):
    return db.query(models.Owner).order_by(models.Owner.id.desc()).all()

def create_owner(db: Session, data: schemas.OwnerCreate):
    owner = models.Owner(**data.model_dump())
    db.add(owner)
    db.commit()
    db.refresh(owner)
    return owner

def list_pets(db: Session):
    return db.query(models.Pet).order_by(models.Pet.id.desc()).all()

def create_pet(db: Session, data: schemas.PetCreate):
    pet = models.Pet(**data.model_dump())
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet

def list_appointments(db: Session):
    return db.query(models.Appointment).order_by(models.Appointment.scheduled_at.desc()).all()

def create_appointment(db: Session, data: schemas.AppointmentCreate):
    appt = models.Appointment(**data.model_dump())
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt

def list_consultations(db: Session):
    return db.query(models.Consultation).order_by(models.Consultation.id.desc()).all()

def create_consultation(db: Session, data: schemas.ConsultationCreate):
    c = models.Consultation(**data.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

def list_invoices(db: Session):
    return db.query(models.Invoice).order_by(models.Invoice.id.desc()).all()

def create_invoice(db: Session, data: schemas.InvoiceCreate):
    inv = models.Invoice(**data.model_dump())
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv
