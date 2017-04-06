from functools import partial
import random
import pprint
import pylab
import csv
import math
import json
from math import radians, cos, sin, asin, sqrt
from shapely.geometry import *
from shapely.ops import cascaded_union
from operator import itemgetter
import time
from datetime import timedelta
from datetime import datetime
#(40.7534561156999970 -73.9817047118999938)
pointLocation = Point(float(40.7534561156999970),float(-73.9817047118999938))
def loopTimeStamps(inputFile):
    
    points = open("data_raw/"+inputFile+".csv","r")
    pointsReader = csv.reader(points)
    next(pointsReader)
    allPoints = []
    for line in pointsReader:
        allPoints.append(line)
        
    i=0
    durationList = []
    
    outputFile = inputFile
    csvWriter = csv.writer(open("data_inuse/"+outputFile+"_id_duration.csv","a"))
    headerRow = ["lat", "lng", "startTimeStamp", "endTimeStamp", "durationSeconds", "gid"]
    csvWriter.writerow(headerRow)
    
    for row in allPoints:
       
        if i < len(allPoints)-1:
            row1 = row
            row2 = allPoints[i+1]
            i+=1
            startTimeStamp = row1[3]
            endTimeStamp = row2[3]
            startTime = datetime.strptime(startTimeStamp,"%Y-%m-%d %H:%M:%S")
            endTime = datetime.strptime(endTimeStamp,"%Y-%m-%d %H:%M:%S")
            duration = endTime-startTime
            durationSeconds = duration.total_seconds()
            lat = float(row1[1])
            lng = float(row1[0])
            coordinates = [lat,lng]
            point = Point(coordinates)
            gid = loopPolygons(point)
            if gid == None:
                print lat,lng
            newRow = [lat, lng, startTimeStamp, endTimeStamp, durationSeconds, str(gid)]
            csvWriter.writerow(newRow)
            
            

def loopPolygons(point):
    with open("data_inuse/nyc_bg.geojson") as f:
        js =json.load(f)
        for i in range(len(js['features'])):
            feature = js['features'][i]
            uid = feature["properties"]["GEOID"]
            polygon = shape(feature['geometry'])
            if polygon.contains(point)==True:
                return uid
            
loopTimeStamps("openpaths_mlotek123")
    