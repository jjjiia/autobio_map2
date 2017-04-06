import csv
import json
import collections
import operator
             

def makeDictionary(inputFile):
    jsonDictionary = {}
        
    with open(inputFile+".csv", 'Ur') as csvfile:
        spamreader = csv.reader(csvfile)
        next(spamreader)
        for row in spamreader:
            print row
            break
            key = row[0]
            value = row[1]
            jsonDictionary[key]=value
            
    with open(inputFile+".json", 'w') as outfile:
        json.dump(jsonDictionary, outfile)


def makeDurationDictionary(inputFile):
    jsonDictionary = {}
        
    with open(inputFile+".csv", 'Ur') as csvfile:
        spamreader = csv.reader(csvfile)
        next(spamreader)
        for row in spamreader:
            key = row[5]
            currentValue = int(float(row[4]))
            if key in jsonDictionary:
                jsonDictionary[key] = jsonDictionary[key] + currentValue
            else:
                jsonDictionary[key]=currentValue
                
            
    with open(inputFile+".json", 'w') as outfile:
        json.dump(jsonDictionary, outfile)
        
        
makeDurationDictionary("data_inuse/openpaths_mlotek123_id_duration")
