import json
from shapely.geometry import Polygon, MultiPolygon, mapping, shape
import csv
shapefile = "nyc_bg.geojson"


bgs=json.load(open(shapefile))

matches = {}




for bgA in bgs["features"]:
    idA = bgA["properties"]["GEOID"]
   # break
    coordinatesA = bgA["geometry"]["coordinates"][0]
   # print tuple(map(tuple, coordinatesA))
    while len(coordinatesA)==1:
        coordinatesA = coordinatesA[0]
    bgAPoly = Polygon(coordinatesA)
    for bgB in bgs["features"]:
            idB = bgB["properties"]["GEOID"]
            if idA != idB:
               # print idA, idB
                coordinatesB = bgB["geometry"]["coordinates"][0]
                while len(coordinatesB)==1:
                    coordinatesB = coordinatesB[0]
               # print tuple(map(tuple, coordinatesB))
                bgBPoly = Polygon(coordinatesB)
                
                intersection = bgBPoly.intersects(bgAPoly)
                if intersection == True:
                   # print idA, idB
                    if idA in matches.keys():
                        matches[idA].append(idB)
                    else:
                        matches[idA]=[]
                        matches[idA].append(idB)
    csvFile = open("neigbors.csv","a")
    csvWriter = csv.writer(csvFile)
    csvWriter.writerow([idA, matches[idA]])

#print matches
outfile = open("neighbors.json","w")
json.dump(matches,outfile)
#
#nhood_dump = {'nhood_blockgroups':nhood_blockgroups,'blockgroup_nhoods':blockgroup_nhoods}
#outfile=open(config['neighborhoods_hash'],'w+')
#json.dump(nhood_dump,outfile)
#outfile.close()
#
