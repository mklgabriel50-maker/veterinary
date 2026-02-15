from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from decimal import Decimal

class SignupIn(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=255)
    role: str = "admin"
    password: str = Field(min_length=6, max_length=128)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class OwnerCreate(BaseModel):
    full_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class OwnerOut(OwnerCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class PetCreate(BaseModel):
    owner_id: int
    name: str
    species: str
    breed: Optional[str] = None
    sex: Optional[str] = None
    age_years: Optional[int] = None
    microchip: Optional[str] = None
    notes: Optional[str] = None

class PetOut(PetCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class AppointmentCreate(BaseModel):
    pet_id: int
    scheduled_at: datetime
    reason: Optional[str] = None
    status: str = "scheduled"
    notes: Optional[str] = None

class AppointmentOut(AppointmentCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ConsultationCreate(BaseModel):
    appointment_id: int
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    weight_kg: Optional[Decimal] = None
    temperature_c: Optional[Decimal] = None

class ConsultationOut(ConsultationCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class InvoiceCreate(BaseModel):
    appointment_id: int
    number: str
    amount: Decimal
    currency: str = "RON"
    status: str = "unpaid"
    notes: Optional[str] = None

class InvoiceOut(InvoiceCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
