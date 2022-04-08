# Sender API
### Api for accessing data related to Sender mobile app.
---

## Description:
- This API will be used in order to access all data needed for Sender climbing app.
- Manages personal info on database
- Manages send stack and todo list on database
- Dynamically scrapes the web for new climbing routes
---

## Technologies:
- Node.js express for API framework
- Puppeteer for scraping
- Mountain project website for route finding
---

## Endpoints:

`GET /areas/id`
* _Gets all sub areas in an area_

`GET /areas/105868674`

returns:
```json
[
    {
        "areaId": "0",
        "areaTitle": "All Locations",
        "areaLevel": 0
    },
    {
        "areaId": "105869162",
        "areaTitle": "BSF (placeholder)",
        "areaLevel": 2
    },
    {
        "areaId": "116800236",
        "areaTitle": "Carter Caves",
        "areaLevel": 2
    },
    {
        "areaId": "121951330",
        "areaTitle": "Cherokee Park",
        "areaLevel": 2
    },
    {
        "areaId": "114179330",
        "areaTitle": "Chicken Head Rock",
        "areaLevel": 2
    },
    {
        "areaId": "119938922",
        "areaTitle": "Foxtown Boulders",
        "areaLevel": 2
    },
    {
        "areaId": "108412222",
        "areaTitle": "Knobs Forest Knobs",
        "areaLevel": 2
    },
    {
        "areaId": "122020712",
        "areaTitle": "Lockegee",
        "areaLevel": 2
    },
    {
        "areaId": "121219967",
        "areaTitle": "Murder Branch",
        "areaLevel": 2
    },
    {
        "areaId": "118577372",
        "areaTitle": "Otter Creek",
        "areaLevel": 2
    },
    {
        "areaId": "115356452",
        "areaTitle": "Purple Bridge",
        "areaLevel": 2
    },
    {
        "areaId": "105841134",
        "areaTitle": "Red River Gorge",
        "areaLevel": 2
    },
    {
        "areaId": "117063210",
        "areaTitle": "River Bouldering",
        "areaLevel": 2
    },
    {
        "areaId": "111188533",
        "areaTitle": "Rockcastle River",
        "areaLevel": 2
    },
    {
        "areaId": "107077561",
        "areaTitle": "Stonecrest",
        "areaLevel": 2
    },
    {
        "areaId": "105869153",
        "areaTitle": "Western Kentucky",
        "areaLevel": 2
    }
]
```

`POST /routes`
* _Gets routes for specific filters_

example body:
```json 
{
    "areaId": 105841134,
    "minYds": "5.4",
    "maxYds": "5.13c",
    "showTrad": true,
    "showSport": false,
    "showTopRope": false,
    "ratingGroup": 2.8,
    "pitchesGroup": 0,
    "sort1": "area",
    "sort2": "rating"
}
```

returns:
```json
[
    {
        "Route": "Charlie",
        "Location": "\"Chocolate Factory > Bald Rock Fork Recreational Preserve (BRRP) > Red River Gorge > Kentucky\"",
        "URL": "https://www.mountainproject.com/route/108415831/charlie",
        "Avg Stars": "3.9",
        "Your Stars": "-1",
        "Route Type": "Trad",
        "Rating": "5.13b",
        "Pitches": "1",
        "Length": "70",
        "Area Latitude": "37.64919",
        "Area Longitude": "-83.71343"
    },
    {
        "Route": "\"Sacred Geometry\"",
        "Location": "\"Long Wall > Northern Gorge > Red River Gorge > Kentucky\"",
        "URL": "https://www.mountainproject.com/route/107667738/sacred-geometry",
        "Avg Stars": "3.5",
        "Your Stars": "-1",
        "Route Type": "Trad",
        "Rating": "\"5.13 PG13\"",
        "Pitches": "2",
        "Length": "80",
        "Area Latitude": "37.8446",
        "Area Longitude": "-83.6686"
    }
]
```

`POST /routes/deatils`
* _Gets details for specific routes_

example body: 
```json 
[
    {"id": "118297380"}
]
```
returns:
```json
[
    {
        "name": "Fugaku ",
        "grade": "5.12d",
        "type": "Sport",
        "rating": 2.2,
        "height": 65,
        "firstAscent": "Ken Saitoh 1/26/20",
        "description": "Right of Starry Night is this similar, but  harder climb. Climb out the juggy roof similar to Starry Night, but you'll have to work a little harder through the bouldery finish to get to the chains. Be aware of loose rock as with all new routes. ",
        "protection": "6 Bolts",
        "location": "20 feet right of starry night. Also goes out the massive roof",
        "areas": [
            {
                "id": "105868674",
                "name": "Kentucky"
            },
            {
                "id": "105841134",
                "name": "Red River Gorge"
            },
            {
                "id": "106585368",
                "name": "Pendergrass Murray Recreational Preserve Pmrp"
            },
            {
                "id": "106124262",
                "name": "The Gallery"
            }
        ],
        "imageUrls": [
            "https://cdn2.apstatic.com/photos/climb/119034251_large_1592097414.jpg",
            "https://cdn2.apstatic.com/photos/climb/119034229_large_1592097294.jpg"
        ],
        "id": "118297380"
    }
]
```

## Disclaimer
- Using mountain project data for commercial use is explicitely against their terms of service. This app is for educational purposes and I do not intent on sellng the final product unless I remove the usable of the mountain project website. However with this in mind I will be developing the app in a way that will be able to run without mountain project and only on free APIs and internal databases in the future.
