from ....config import Base
from sqlalchemy import Column, String, Integer

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    dob = Column(String, nullable=True)
