import json
from shapely.geometry import Polygon, MultiPolygon, mapping, shape

#chicago_config ={
#    'nhoods_file' : 'data/neighborhoods/zillow-chicago.geojson',
#    'blockgroups_file' : 'data/bg_shape/chicago_bg.geojson',
#    'neighborhoods_hash': 'data/bg_shape/chicago_neighborhoods.json'
#}
#
#
boston_config ={
    ##'nhoods_file' : 'data/neighborhoods/zillow-boston_cambridge.geojson',
    'nhoods_file' : 'nyc_bg.geojson',
    ##'blockgroups_file' : 'data/bg_shape/boston_bg.geojson',
    'blockgroups_file' : 'nyc_bg.geojson',
    'neighborhoods_hash': 'data/bg_shape/boston_neighborhoods.json'
}

config =  boston_config

nhoods_json=json.load(open(config['nhoods_file']))

blockgroups_json=json.load(open(config['blockgroups_file']))
shape_dict={}
for feature in blockgroups_json['features']:
    feature['properties']['GEOID']
    shape_dict[feature['properties']['GEOID']] = shape({"type": feature['geometry']['type'], "coordinates": feature['geometry']['coordinates']})

blockgroup_shapes = {}
for blockgroup in blockgroups_json['features']:
   polygon = None
   if blockgroup['geometry']['type'] == 'Polygon':
       polygon = Polygon(blockgroup['geometry']['coordinates'][0])
   elif blockgroup['geometry']['type'] == 'MultiPolygon':
       parts = []
       for p in blockgroup['geometry']['coordinates']:
          parts.append(Polygon(p[0]))
       multipolygon = MultiPolygon(parts)
       polygon = MultiPolygon(parts)
   blockgroup_shapes[blockgroup['properties']['GEOID']] = polygon
   polygon = None

nhood_shapes = {}
for nhood in nhoods_json['features']:
   polygon = None
   if nhood['geometry']['type'] == 'Polygon':
       polygon = Polygon(nhood['geometry']['coordinates'][0])
   elif nhood['geometry']['type'] == 'MultiPolygon':
       parts = []
       for p in nhood['geometry']['coordinates']:
          parts.append(Polygon(p[0]))
       multipolygon = MultiPolygon(parts)
       polygon = MultiPolygon(parts)
   nhood_shapes[nhood['properties']['NAME']] = polygon
   polygon = None

nhood_blockgroups = {}
blockgroup_nhoods = {}

for blockgroup_name, blockgroup_shape in blockgroup_shapes.iteritems():
   for nhood_name, nhood_shape in nhood_shapes.iteritems():
      blockgroup_nhoods[blockgroup_name] = []
   

for nhood_name, nhood_shape in nhood_shapes.iteritems():
   nhood_blockgroups[nhood_name] = []
   for blockgroup_name, blockgroup_shape in blockgroup_shapes.iteritems():
       try:
          intersection = blockgroup_shape.intersection(nhood_shape)
       except:
          intersection = blockgroup_shape.intersection(nhood_shape.convex_hull)
       if (intersection) and (intersection.area/ blockgroup_shape.area > 0.5):
           print blockgroup_name, nhood_name, intersection.area/ blockgroup_shape.area
           nhood_blockgroups[nhood_name].append([blockgroup_name, intersection.area/ blockgroup_shape.area])
           blockgroup_nhoods[blockgroup_name].append(nhood_name)

nhood_dump = {'nhood_blockgroups':nhood_blockgroups,'blockgroup_nhoods':blockgroup_nhoods}
outfile=open(config['neighborhoods_hash'],'w+')
json.dump(nhood_dump,outfile)
outfile.close()

