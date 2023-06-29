# This script is meant to be run manually by me to update public data that changes seasonally 
# eg: images & metadata for the current season pass, current season pass challenges, etc.
# note: this script is not handling the theming of the site, only the data that changes seasonally
# we'll use the the manifest that bungie gives to do so, when given the new season's name

import sys, sqlalchemy
from sqlalchemy.orm import sessionmaker
from models import DestinySeasonDefinition

def seasonScrape (seasonName, manifestLocation):
    # this function will scrape the manifest for the new season's data, and download the files in the right place & format
    # this function will be expanded as we write more of the site

    # connect to the manifest db
    engine = sqlalchemy.create_engine('sqlite:///' + manifestLocation)
    Session = sessionmaker(bind=engine)
    session = Session()

    # get the season's data from the manifest using the season name
    seasonData = getSeasonData(session, seasonName)
    # if we didn't find the right row, error
    if seasonData == None:
        print("Error: season name not found in manifest")
        exit(1)
    
    

    pass

def getSeasonData (session, seasonName):
    # this function will get the season's data from the manifest using the season name
    # to do so we look in the DestinySeasonDefinition table for the row with the right name within the json blob
    # this table's contents are entries of an id and a json blob, so we'll need to parse the json blob to get the data we want
    
    # loop through the rows in the table until we find the right one (as I can't see an order to the table)
    for row in session.query(DestinySeasonDefinition).all():
        # parse the json blob to get the season name
        curSeasonName = row.jsonBlob['displayProperties']['name']
        if curSeasonName == seasonName:
            # we found the right row, return the json blob
            return row.jsonBlob
    # if we get here, we didn't find the right row, so return None
    return None

if __name__ == "__main__":
    # the script will be run in the terminal, and will be passed the name of the new season & the location of the manifest sqlite3 db
    # error if not passed 2 arguments
    if len(sys.argv) != 3:
        print("Error: incorrect number of arguments passed to script")
        print("Usage: python seasonScript.py <seasonName> <manifestLocation>")
        exit(1)
    seasonName = sys.argv[1]
    manifestLocation = sys.argv[2]
    seasonScrape(seasonName, manifestLocation)