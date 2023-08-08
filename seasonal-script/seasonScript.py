# This script is meant to be run manually by me to update public data that changes seasonally
# eg: images & metadata for the current season pass, current season pass challenges, etc.
# note: this script is not handling the theming of the site, only the data that changes seasonally
# we'll use the the manifest that bungie gives to do so, when given the new season's name

import sys
import os
import requests
import sqlalchemy
import shutil
import json as jsonlib
from sqlalchemy.orm import sessionmaker
from models import DestinySeasonDefinition, DestinyProgressionDefinition, DestinyPresentationNodeDefinition, DestinyRecordDefinition, DestinyObjectiveDefinition, DestinyInventoryItemDefinition

debug = False
baseUrl = "https://www.bungie.net"


def seasonScrape(seasonName, manifestLocation):
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
    seasonPassProgressionData = getSeasonPassProgressionData(
        session, seasonData['seasonPassProgressionHash'])
    if seasonPassProgressionData == None:
        print("Error: season pass progression hash not found in manifest")
        exit(1)

    # use the season's data to get the season challenges data
    # example season hash: 2758726569 (for season of the deep)
    # we get the season challenge root presentation node hash from the season data and work our way down the tree to get the challenges
    # get the seasonPassChallengesPresentationNodeHash from the season data
    seasonPassChallengesPresentationNodeHash = seasonData['seasonalChallengesPresentationNodeHash']
    # use it to get the seasonPassChallengesPresentationNode from the manifest (from the DestinyPresentationNodeDefinition table)
    seasonPassChallengesPresentationNode = session.query(DestinyPresentationNodeDefinition).filter(
        DestinyPresentationNodeDefinition.json['hash'] == str(seasonPassChallengesPresentationNodeHash)).first()
    # if we didn't find a matching row, error
    if seasonPassChallengesPresentationNode == None:
        print("Error: season pass challenges presentation node hash not found in manifest")
        exit(1)

    # we now have the seasonPassChallengesPresentationNode, which is a json with a tree other presentation nodes as children
    # we want the weekly challenges, which is the first child of the seasonPassChallengesPresentationNode
    weeklyPresentationNodeHash = seasonPassChallengesPresentationNode.json[
        'children']['presentationNodes'][0]['presentationNodeHash']
    # use it to get the weeklyPresentationNode from the manifest (from the DestinyPresentationNodeDefinition table)
    weeklyPresentationNode = session.query(DestinyPresentationNodeDefinition).filter(
        DestinyPresentationNodeDefinition.json['hash'] == str(weeklyPresentationNodeHash)).first()
    # if we didn't find a matching row, error
    if weeklyPresentationNode == None:
        print("Error: weekly presentation node hash not found in manifest")
        exit(1)

    # now to get all the children hashes of the weeklyPresentationNode (these are the hashes of each week's presentation node)
    weeklyPresentationNodeChildrenHashes = []
    for child in weeklyPresentationNode.json['children']['presentationNodes']:
        weeklyPresentationNodeChildrenHashes.append(
            child['presentationNodeHash'])

    # Convert the integers to strings for the json comparison
    weeklyPresentationNodeChildrenHashes = [
        str(hash) for hash in weeklyPresentationNodeChildrenHashes]

    # use the hashes to get the weeklyPresentationNodes from the manifest (from the DestinyPresentationNodeDefinition table)
    # this is an array of the weekly presentation nodes
    weeklyPresentationNodes = session.query(DestinyPresentationNodeDefinition).filter(
        DestinyPresentationNodeDefinition.json['hash'].in_(weeklyPresentationNodeChildrenHashes)).all()
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

    # now we have the weeklyChallengeRecords, we can use the record hashes to get the weeklyChallengeData, a list of objects in the form [week, challengeName, challengeDescription, rewardItemData, challengeObjectiveHashes]
    # the rewardItemData and challengeObjectiveHashes will be in seperate arrays of objects in the form [itemHash, quantity], and objectiveHash respectively
    weeklyChallengeData = []
    for weeklyChallengeRecord in weeklyChallengeRecords:
        week = weeklyChallengeRecord[0]
        recordHash = str(weeklyChallengeRecord[1])
        # get the record from the manifest (from the DestinyRecordDefinition table)
        record = session.query(DestinyRecordDefinition).filter(
            DestinyRecordDefinition.json['hash'] == recordHash).first()
        # if we didn't find a matching row, error
        if record == None:
            print("Error: record hash not found in manifest:" + str(recordHash))
            exit(1)
        # get the record's name and description
        challengeName = record.json['displayProperties']['name']
        challengeDescription = record.json['displayProperties']['description']
        # get the challenge's icon url
        challengeIconUrl = baseUrl + record.json['displayProperties']['icon']
        # get the record's rewardItemData
        rewardItemData = []
        for rewardItem in record.json['rewardItems']:
            rewardItemData.append(
                [rewardItem['itemHash'], rewardItem['quantity']])
        # the record's objectiveHashes is a list of hashes, each of which is a challenge objective
        challengeObjectiveHashes = []
        for objectiveHash in record.json['objectiveHashes']:
            challengeObjectiveHashes.append(objectiveHash)
        # add the challenge data to the weeklyChallengeData
        weeklyChallengeData.append([week, challengeName, challengeIconUrl,
                                   challengeDescription, rewardItemData, challengeObjectiveHashes])

    # parse the seasonPassProgressionData to get an array of the free and premium season pass rank rewards
    # the free and premium rewards will be in seperate arrays of objects in the form [level, rewardItemHash, rewardItemQuantity]
    # example progression hash: 3127357249 (for season of the deep)

    rankRewards = seasonPassProgressionData['rewardItems']
    freeRankRewards = []
    premiumRankRewards = []
    for rankReward in rankRewards:
        if rankReward['uiDisplayStyle'] == 'free':
            freeRankRewards.append(
                [rankReward['rewardedAtProgressionLevel'], rankReward['itemHash'], rankReward['quantity']])
        elif rankReward['uiDisplayStyle'] == 'premium':
            premiumRankRewards.append(
                [rankReward['rewardedAtProgressionLevel'], rankReward['itemHash'], rankReward['quantity']])
        else:
            print("Error: unexpected uiDisplayStyle in rank rewards")
            exit(1)

    # now that we have all the data for the seasonal challenges and pass itself, we can start to write it to output
    # this will take the form of saving files to the seasonalData folder
    # the seasonChallengesData subfolder will contain the weekly challenge data in a set of files named <week>.json
    # the seasonPassData subfolder will contain the season pass data in a subfolder called seasonPassImages
    # the images will have names containing their metadata, and will be in jpg format
    # this is in the form of rank<rank number>_<free/premium>.jpg
    # the rest of the metadata for the images will be in a file called seasonPassData.json
    # this will contain a list of objects (for each image) with the file name, item name, item description, and item quantity, rank, and free/premium status

    # delete the previous seasonalData folder if it exists
    if os.path.exists('seasonalData'):
        shutil.rmtree('seasonalData')

    # Create the various folders we'll output to
    os.makedirs('seasonalData')
    os.makedirs('seasonalData/seasonChallengesData')
    os.makedirs('seasonalData/seasonChallengesData/seasonChallengeRewardImages')
    os.makedirs('seasonalData/seasonChallengesData/seasonChallengeIcons')
    os.makedirs('seasonalData/seasonPassData')
    os.makedirs('seasonalData/seasonPassData/seasonPassImages')

    # download the season pass icon to the seasonalData folder
    seasonIconUrl = baseUrl + seasonData['displayProperties']['icon']
    response = requests.get(seasonIconUrl)
    if response.status_code == 200:
        with open('seasonalData/seasonIcon.jpg', 'wb') as f:
            f.write(response.content)
    else:
        print("Error: seasonal icon download failed")
        exit(1)

    # writing the season pass data
    # iterating through the free and premium rank rewards
    # constructing the json for the seasonPassData.json file as we go (a dict we'll convert to json at the end)
    seasonPassDataJSON = {}
    for rankReward in freeRankRewards:
        rankNumber = rankReward[0]
        itemQuantity = rankReward[2]
        rewardInfo = getRewardItemInfo(session, rankReward[1])
        itemName = rewardInfo[0]
        itemDescription = rewardInfo[1]
        itemImageUrl = rewardInfo[2]
        # download the image to the seasonPassImages folder & name it with the metadata via requests
        response = requests.get(itemImageUrl)
        if response.status_code == 200:
            with open('seasonalData/seasonPassData/seasonPassImages/rank' + str(rankNumber) + '_free' + '.jpg', 'wb') as f:
                f.write(response.content)
            # add the image metadata to the seasonPassDataJSON
            seasonPassDataJSON['rank' + str(rankNumber) + '_free'] = {
                # the file name will be the same as the key, but with '.jpg' appended
                'fileName': 'rank' + str(rankNumber) + '_free' + '.jpg',
                'rank': str(rankNumber),
                'freeOrPremium': 'free',
                'itemName': itemName,
                'itemDescription': itemDescription,
                'itemQuantity': str(itemQuantity)
            }
        else:
            print("Error: image download failed for item: " +
                  itemName + " with url: " + itemImageUrl)
            exit(1)

    for rankReward in premiumRankRewards:
        rankNumber = rankReward[0]
        itemQuantity = rankReward[2]
        rewardInfo = getRewardItemInfo(session, rankReward[1])
        itemName = rewardInfo[0]
        itemDescription = rewardInfo[1]
        itemImageUrl = rewardInfo[2]
        # download the image to the seasonPassImages folder & name it with the metadata via requests
        response = requests.get(itemImageUrl)
        if response.status_code == 200:
            with open('seasonalData/seasonPassData/seasonPassImages/rank' + str(rankNumber) + '_premium' + '.jpg', 'wb') as f:
                f.write(response.content)
            # add the image metadata to the seasonPassDataJSON
            seasonPassDataJSON['rank' + str(rankNumber) + '_premium'] = {
                # the file name will be the same as the key, but with '.jpg' appended
                'fileName': 'rank' + str(rankNumber) + '_premium' + '.jpg',
                'rank': str(rankNumber),
                'freeOrPremium': 'premium',
                'itemName': itemName,
                'itemDescription': itemDescription,
                'itemQuantity': str(itemQuantity)
            }
        else:
            print("Error: image download failed for item: " +
                  itemName + " with url: " + itemImageUrl)
            exit(1)

    with open('seasonalData/seasonPassData/seasonPassData.json', 'w') as f:
        f.write(jsonlib.dumps(seasonPassDataJSON, indent=4))

    # writing the weekly challenge data
    # check how many weeks of challenges we have within the data
    # this is done by checking for number of distinct weeks in the weeklyChallengeData
    weeks = []
    for weeklyChallenge in weeklyChallengeData:
        week = weeklyChallenge[0]
        if week not in weeks:
            weeks.append(week)
    # now we have the number of weeks, we can iterate through them and write the data to files
    seasonalChallengesMetaDataJSON = {}
    for week in weeks:
        # get the weekly challenges for this week
        curWeekChallenges = []
        for weeklyChallenge in weeklyChallengeData:
            if weeklyChallenge[0] == week:
                curWeekChallenges.append(weeklyChallenge)
        # write the data to the file
        # the json will contain a list of objects, each of which is a challenge
        # each challenge will have the following properties:
        # name, description, rewardItems, and objectives
        # the rewardItems and objectives will both be arrays of objects
        # rewardItems will have the name, description, and quantity of the item
        # we'll also check if the icon image for the item already exists, and if not, download it to the seasonChallengeRewardImages subfolder of the seasonChallengesData folder
        # objectives will have the name, startValue, and completionValue of the objective

        # construct the json dict as we read through the curWeekChallenges
        weeklyChallengeJSON = {}
        for weeklyChallenge in curWeekChallenges:
            # get the challenge info
            challengeName = weeklyChallenge[1]
            challengeIconUrl = weeklyChallenge[2]
            challengeDescription = weeklyChallenge[3]
            challengeRewardItemsData = weeklyChallenge[4]
            challengeObjectivesHashes = weeklyChallenge[5]

            # download the challenge icon to the seasonChallengeIcons folder
            response = requests.get(challengeIconUrl)
            if response.status_code == 200:
                with open('seasonalData/seasonChallengesData/seasonChallengeIcons/' + challengeName + '.jpg', 'wb') as f:
                    f.write(response.content)
            else:
                print("Error: image download failed for challenge: " +
                      challengeName + " with url: " + challengeIconUrl)
                exit(1)
                # add the challenge info to the json
            weeklyChallengeJSON[challengeName] = {
                'name': challengeName,
                'week': str(week),
                'description': challengeDescription,
                'icon': challengeName + '.jpg',
                'rewardItems': [],
                'objectives': []
            }
            # iterate through the reward items
            for rewardItemData in challengeRewardItemsData:
                rewardItemInfo = getRewardItemInfo(
                    session, rewardItemData[0])
                rewardItemName = rewardItemInfo[0]
                rewardItemDescription = rewardItemInfo[1]
                rewardItemIconUrl = rewardItemInfo[2]
                rewardItemQuantity = rewardItemData[1]
                # check if the image already exists
                if not os.path.exists('seasonalData/seasonChallengesData/seasonChallengeRewardImages/' + rewardItemName + '.jpg'):
                    # it doesn't, so download it
                    response = requests.get(rewardItemIconUrl)
                    if response.status_code == 200:
                        with open('seasonalData/seasonChallengesData/seasonChallengeRewardImages/' + rewardItemName + '.jpg', 'wb') as f:
                            f.write(response.content)
                    else:
                        print("Error: image download failed for item: " +
                              rewardItemName + " with url: " + rewardItemIconUrl)
                        exit(1)
                # add the reward item info to the json
                weeklyChallengeJSON[challengeName]['rewardItems'].append({
                    'name': rewardItemName,
                    'description': rewardItemDescription,
                    'quantity': str(rewardItemQuantity)
                })
            for objectiveHash in challengeObjectivesHashes:
                objectiveInfo = getObjectiveInfo(session, objectiveHash)
                objectiveName = objectiveInfo[0]
                objectiveStartValue = objectiveInfo[1]
                objectiveCompletionValue = objectiveInfo[2]
                # add the objective info to the json
                weeklyChallengeJSON[challengeName]['objectives'].append({
                    'name': objectiveName,
                    'startValue': str(objectiveStartValue),
                    'completionValue': str(objectiveCompletionValue)
                })
        # add this week's weeklyChallengeJSON to the seasonalChallengesMetaDataJSON
        seasonalChallengesMetaDataJSON[week] = weeklyChallengeJSON
    # sort the seasonalChallengesMetaDataJSON by week alphabetically
    seasonalChallengesMetaDataJSON = dict(
        sorted(seasonalChallengesMetaDataJSON.items()))

    # Move the week "Seasonal" to the end of the list if it exists
    if 'Seasonal' in seasonalChallengesMetaDataJSON:
        seasonalChallengesMetaDataJSON['Seasonal'] = seasonalChallengesMetaDataJSON.pop('Seasonal')

    # write the seasonal json to the file
    with open('seasonalData/seasonChallengesData/seasonalChallengesMetaData.json', 'w') as f:
        f.write(jsonlib.dumps(seasonalChallengesMetaDataJSON, indent=4))


def getSeasonData(session, seasonName):
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


def getSeasonPassProgressionData(session, seasonPassProgressionHash):
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


def getRewardItemInfo(session, rewardItemHash):
    # this function will get the reward item's data from the manifest using the reward item hash
    # to do so we look in the DestinyInventoryItemDefinition table for the row with the right hash within the json

    # find a row with the correct hash in the json
    row = session.query(DestinyInventoryItemDefinition).filter(
        DestinyInventoryItemDefinition.json['hash'] == str(rewardItemHash)).first()
    # if we didn't find a matching row, error
    if row == None:
        print("Error: reward item hash not found in manifest:" + str(rewardItemHash))
        exit(1)
    # we found the right row, now to parse it for the data we want
    rewardItemName = row.json['displayProperties']['name']
    rewardItemDescription = row.json['displayProperties']['description']
    rewardIconUrl = baseUrl + row.json['displayProperties']['icon']
    # return the data
    return [rewardItemName, rewardItemDescription, rewardIconUrl]


def getObjectiveInfo(session, objectiveHash):
    # this function will get the objective's data from the manifest using the objective hash
    # to do so we look in the DestinyObjectiveDefinition table for the row with the right hash within the json

    # find a row with the correct hash in the json
    row = session.query(DestinyObjectiveDefinition).filter(
        DestinyObjectiveDefinition.json['hash'] == str(objectiveHash)).first()
    # if we didn't find a matching row, error
    if row == None:
        print("Error: objective hash not found in manifest:" + str(objectiveHash))
        exit(1)
    # we found the right row, now to parse it for the data we want
    objectiveName = row.json['progressDescription']
    defaultValue = row.json['unlockValueHash']
    completionValue = row.json['completionValue']
    # return the data
    return [objectiveName, defaultValue, completionValue]


if __name__ == "__main__":
    # the script will be run in the terminal, and will be passed the name of the new season & the location of the manifest sqlite3 db
    # error if not passed 2 arguments

    # if debug is true, we'll use the default values for the arguments
    seasonName = "Season of the Deep"
    manifestLocation = "manifest.sqlite3"

    # and to handle the vscode debugger's not starting the working directory in the right place
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    if not debug:
        if len(sys.argv) != 3:
            print("Error: incorrect number of arguments passed to script")
            print("Usage: python seasonScript.py <seasonName> <manifestLocation>")
            exit(1)
        seasonName = sys.argv[1]
        manifestLocation = sys.argv[2]
    seasonScrape(seasonName, manifestLocation)
