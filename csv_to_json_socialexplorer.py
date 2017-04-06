import csv
import json
import collections
import operator

def checkColumns(fileName):
    doNotSaveColumn = []
    
    with open(fileName+".csv", 'Ur') as csvfile:
        spamreader = csv.reader(csvfile)
        
        for row in spamreader: 
            header = row
            break
        print header
        for h in range(len(header)):
            doNotSave = True
            
            for row in spamreader:
                value = row[h]
                if value!=0 and value !="":
                    doNotSave = False
                    print value, header[h]
                    break
            if doNotSave == True:
                doNotSaveColumn.append(header[h])
        return doNotSaveColumn
#checkColumns("rawdata/R11377811_SL150")                

def makeDictionary(fileName):
        doNotSave = ["Geo_FIPS","Geo_Name Block Group 1","Geo_COUSUB","Geo_REGION","Geo_PLACESE","Geo_PLACE","Geo_DIVISION","Geo_STATECE","Geo_US","Geo_CONCIT","Geo_AIANHH","Geo_AIANHHFP","Geo_AIHHTLI","Geo_AITSCE","Geo_AITS","Geo_ANRC","Geo_CBSA","Geo_CSA","Geo_METDIV","Geo_MACC","Geo_MEMI","Geo_NECTA","Geo_CNECTA","Geo_NECTADIV","Geo_UA","Geo_UACP","Geo_CDCURR","Geo_SLDU","Geo_SLDL","Geo_VTD","Geo_ZCTA3","Geo_ZCTA5","Geo_SUBMCD","Geo_SDELM","Geo_SDSEC","Geo_SDUNI","Geo_UR","Geo_PCI","Geo_TAZ","Geo_UGA","Geo_BTTR","Geo_BTBG","Geo_PUMA5","Geo_PUMA1"]
        #doNotSave = checkColumns(fileName)     
        bgidDictionary = {}
        
        with open(fileName+".csv", 'Ur') as csvfile:
            spamreader = csv.reader(csvfile)
            
            for row in spamreader: 
                header = row
                break
            print header
            
            for row in spamreader: 

                bgid = row[0]
                bgidDictionary[bgid]={}
                for i in range(len(header)):
                    if (header[i] in doNotSave)== False:
                        key = header[i]
                        value = row[i]
#                        print key, value
                        bgidDictionary[bgid][key]=value
#        print bgidDictionary
        with open(fileName+".json", 'w') as outfile:
            json.dump(bgidDictionary, outfile)

makeDictionary("data_inuse/R11381234_SL150")
