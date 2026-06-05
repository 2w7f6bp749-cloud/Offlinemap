const map = L.map('map');

map.setView([42.85,140.65],10);

// 標準地図
const standard = L.tileLayer(
'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
{
attribution:'国土地理院',
maxZoom:18
}
);

// 陰影起伏図
const hillshade = L.tileLayer(
'https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png',
{
opacity:0.45,
maxNativeZoom:16,
maxZoom:18
}
);

// 傾斜量図
const slope = L.tileLayer(
'https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png',
{
opacity:0.45,
maxNativeZoom:15,
maxZoom:18
}
);

standard.addTo(map);

let mapMode = 0;

const layerBtn =
document.getElementById('layerBtn');

layerBtn.addEventListener('click',()=>{

mapMode++;

if(mapMode>2){
mapMode=0;
}

map.removeLayer(hillshade);
map.removeLayer(slope);

switch(mapMode){

case 0:

layerBtn.innerText='標準';

break;

case 1:

hillshade.addTo(map);

layerBtn.innerText='陰影';

break;

case 2:

slope.addTo(map);

layerBtn.innerText='傾斜';

break;

}

});

// GPS

const gpsBtn =
document.getElementById('gpsBtn');

let watchId = null;
let following = false;
let marker = null;

gpsBtn.addEventListener('click',()=>{

if(!following){

following=true;

gpsBtn.classList.add(
'following'
);

watchId=
navigator.geolocation.watchPosition(

(pos)=>{

const lat=
pos.coords.latitude;

const lng=
pos.coords.longitude;

if(!marker){

marker=
L.circleMarker(
[lat,lng],
{
radius:8,
weight:2
}
).addTo(map);

}else{

marker.setLatLng(
[lat,lng]
);

}

map.setView(
[lat,lng]
);

},

(err)=>{

gpsBtn.classList.remove(
'following'
);

gpsBtn.classList.add(
'error'
);

following=false;

alert(
'位置情報取得に失敗しました'
);

},

{
enableHighAccuracy:true,
maximumAge:0,
timeout:10000
}

);

}else{

following=false;

gpsBtn.classList.remove(
'following'
);

if(watchId){

navigator.geolocation.clearWatch(
watchId
);

}

}

});
