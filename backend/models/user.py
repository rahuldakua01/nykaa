from db.base import Base
from sqlalchemy import Column,Integer,String

class User(Base):
    __tablename__ = "Rahul"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String, index=True,nullable=False)
    phone = Column(Integer,unique=True,index=True,nullable=False)
    mail = Column(String,unique=True,index=True,nullable=False)
    hashed_password = Column(String,index=True,nullable=False)