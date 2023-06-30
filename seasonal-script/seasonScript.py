# This script is meant to be run manually by me to update public data that changes seasonally 
# eg: images & metadata for the current season pass, current season pass challenges, etc.
# note: this script is not handling the theming of the site, only the data that changes seasonally
# we'll use the the manifest that bungie gives to do so, when given the new season's name

import sys, sqlalchemy, json
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql.expression import func
from models import DestinySeasonDefinition, DestinyProgressionDefinition, DestinyPresentationNodeDefinition

debug = True
baseUrl = "https://www.bungie.net"

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
    
    # get the season's pass data using the season's hash from the season's data
    seasonPassProgressionData = getSeasonPassProgressionData(session, seasonData['seasonPassProgressionHash'])
    if seasonPassProgressionData == None:
        print("Error: season pass progression hash not found in manifest")
        exit(1)

    # use the season's data to get the season challenges data
    # example season hash: 2758726569 (for season of the deep)
    # we get the season challenge root presentation node hash from the season data and work our way down the tree to get the challenges
    # get the seasonPassChallengesPresentationNodeHash from the season data
    seasonPassChallengesPresentationNodeHash = seasonData['seasonPassChallengesPresentationNodeHash']
    # use it to get the seasonPassChallengesPresentationNode from the manifest (from the DestinyPresentationNodeDefinition table)
    seasonPassChallengesPresentationNode = session.query(DestinyPresentationNodeDefinition).filter(DestinyPresentationNodeDefinition.json['hash'] == seasonPassChallengesPresentationNodeHash).first()
    # if we didn't find a matching row, error
    if seasonPassChallengesPresentationNode == None:
        print("Error: season pass challenges presentation node hash not found in manifest")
        exit(1)
    
    # we now have the seasonPassChallengesPresentationNode, which is a json with a tree other presentation nodes as children
    # we want the weekly challenges, which is the first child of the seasonPassChallengesPresentationNode
    weeklyPresentationNodeHash = seasonPassChallengesPresentationNode.json['children']['presentationNodes'][0]['presentationNodeHash']
    # use it to get the weeklyPresentationNode from the manifest (from the DestinyPresentationNodeDefinition table)
    weeklyPresentationNode = session.query(DestinyPresentationNodeDefinition).filter(DestinyPresentationNodeDefinition.json['hash'] == weeklyPresentationNodeHash).first()
    # if we didn't find a matching row, error
    if weeklyPresentationNode == None:
        print("Error: weekly presentation node hash not found in manifest")
        exit(1)
    
    # now to get all the children hashes of the weeklyPresentationNode (these are the hashes of each week's presentation node)
    weeklyPresentationNodeChildrenHashes = []
    for child in weeklyPresentationNode.json['children']['presentationNodes']:
        weeklyPresentationNodeChildrenHashes.append(child['presentationNodeHash'])
    
    # use the hashes to get the weeklyPresentationNodes from the manifest (from the DestinyPresentationNodeDefinition table)
    # this is an array of the weekly presentation nodes
    weeklyPresentationNodes = session.query(DestinyPresentationNodeDefinition).filter(DestinyPresentationNodeDefinition.json['hash'].in_(weeklyPresentationNodeChildrenHashes)).all()
    # if we didn't find a matching row, error
    if weeklyPresentationNodes == None:
        print("Error: weekly presentation nodes (children of weekly) hashes not found in manifest")
        exit(1)

    # use weeklyPresentationNodes to get the weeklyChallengeRecords, a list of objects in the form [week, recordHash]
    # the week is the name within the displayProperties of the weeklyPresentationNode
    weeklyChallengeRecords = []
    for weeklyPresentationNode in weeklyPresentationNodes:
        week = weeklyPresentationNode.json['displayProperties']['name']
        # each week has serveral records, which are the week's challenges
        for record in weeklyPresentationNode.json['children']['records']:
            weeklyChallengeRecords.append([week, record['recordHash']])
    
    # now we have the weeklyChallengeRecords, we can use the record hashes to get the weeklyChallengeData, a list of objects in the form [week, challengeName, challengeDescription, rewardItemHashes, rewardItemQuantities, completionCriteria]
    

    # parse the seasonPassProgressionData to get an array of the free and premium season pass rank rewards
    # the free and premium rewards will be in seperate arrays of objects in the form [level, rewardItemHash, rewardItemQuantity]
    # example progression hash: 3127357249 (for season of the deep)

    rankRewards = seasonPassProgressionData['rewardItems']
    freeRankRewards = []
    premiumRankRewards = []
    for rankReward in rankRewards:
        if rankReward['uiDisplayStyle'] == 'free':
            freeRankRewards.append([rankReward['rewardedAtProgressionLevel'], rankReward['itemHash'], rankReward['quantity']])
        elif rankReward['uiDisplayStyle'] == 'premium':
            premiumRankRewards.append([rankReward['rewardedAtProgressionLevel'], rankReward['itemHash'], rankReward['quantity']])
        else:
            print("Error: unexpected uiDisplayStyle in rank rewards")
            exit(1)



    pass

def getSeasonData (session, seasonName):
    # this function will get the season's data from the manifest using the season name
    # to do so we look in the DestinySeasonDefinition table for the row with the right name within the json
    # this table's contents are entries of an id and a json, so we'll need to parse the json to get the data we want
    
    # loop through the rows in the table until we find the right one (as I can't see an order to the table)
    for row in session.query(DestinySeasonDefinition).all():
        # parse the json to get the season name
        curSeasonName = row.json['displayProperties']['name']
        if curSeasonName == seasonName:
            # we found the right row, return the json
            return row.json
    # if we get here, we didn't find the right row, so return None
    return None

def getSeasonPassProgressionData (session, seasonPassProgressionHash):
    # this function will get the season pass data from the manifest using the season's progression hash
    # to do so we look in the DestinyProgressionDefinition table for the row with the right hash within the json

    # loop through the rows in the table until we find the right one (as I can't see an order to the table)
    for row in session.query(DestinyProgressionDefinition).all():
        # parse the json to get the season pass hash
        curSeasonPassProgressionHash = row.json['hash']
        if curSeasonPassProgressionHash == seasonPassProgressionHash:
            # we found the right row, return the json
            return row.json
    # if we get here, we didn't find the right row, so return None
    return None

if __name__ == "__main__":
    # the script will be run in the terminal, and will be passed the name of the new season & the location of the manifest sqlite3 db
    # error if not passed 2 arguments

    # if debug is true, we'll use the default values for the arguments
    seasonName = "Season of the Deep"
    manifestLocation = "manifest.sqlite3"

    if not debug:
        if len(sys.argv) != 3:
            print("Error: incorrect number of arguments passed to script")
            print("Usage: python seasonScript.py <seasonName> <manifestLocation>")
            exit(1)
        seasonName = sys.argv[1]
        manifestLocation = sys.argv[2]
    seasonScrape(seasonName, manifestLocation)