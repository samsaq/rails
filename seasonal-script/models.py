# the database model for the seasonal script
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DestinySeasonDefinition(Base):
    __tablename__ = 'DestinySeasonDefinition'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    json = sqlalchemy.Column(sqlalchemy.JSON)

class DestinyProgressionDefinition(Base):
    __tablename__ = 'DestinyProgressionDefinition'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    json = sqlalchemy.Column(sqlalchemy.JSON)

class DestinyPresentationNodeDefinition(Base):
    __tablename__ = 'DestinyPresentationNodeDefinition'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    json = sqlalchemy.Column(sqlalchemy.JSON)

class DestinyRecordDefinition(Base):
    __tablename__ = 'DestinyRecordDefinition'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    json = sqlalchemy.Column(sqlalchemy.JSON)

class DestinyObjectiveDefinition(Base):
    __tablename__ = 'DestinyObjectiveDefinition'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    json = sqlalchemy.Column(sqlalchemy.JSON)

class DestinyInventoryItemDefinition(Base):
    __tablename__ = 'DestinyInventoryItemDefinition'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    json = sqlalchemy.Column(sqlalchemy.JSON)