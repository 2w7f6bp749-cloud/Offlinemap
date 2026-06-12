const map = L.map(‘map’,{
zoomControl:false
});

map.setView([42.85,140.65],10);

// 標準地図
const standard = L.tileLayer(
‘https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png’,
{
attribution:‘国土地理院’,
maxZoom:18
}
);

// 陰影起伏図
const hillshade = L.tileLayer(
‘https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png’,
{
opacity:0.45,
maxNativeZoom:16,
maxZoom:18
}
);

// 傾斜量図
const slope = L.tileLayer(
‘https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png’,
{
opacity:0.45,
maxNativeZoom:15,
maxZoom:18
}
);

standard.addTo(map);

let mapMode = 0;

const layerBtn =
document.getElementById(‘layerBtn’);

layerBtn.addEventListener(‘click’,()=>{

mapMode++;

if(mapMode>2){
mapMode=0;
}

map.removeLayer(hillshade);
map.removeLayer(slope);

switch(mapMode){

case 0:
layerBtn.innerText=‘標準’;
break;

case 1:
hillshade.addTo(map);
layerBtn.innerText=‘陰影’;
break;

case 2:
slope.addTo(map);
layerBtn.innerText=‘傾斜’;
break;

}

});

// GPS

const gpsBtn =
document.getElementById(‘gpsBtn’);

const compassBtn =
document.getElementById(‘compassBtn’);

const altitudeLabel =
document.getElementById(‘altitude’);

let watchId = null;
let following = false;

let marker = null;
let markerElement = null;

let heading = 0;
let compassEnabled = false;

// Apple風マーカー

const userIcon = L.divIcon({

className:‘user-marker’,

html:<svg viewBox="0 0 100 100"> <path fill="#2196f3" d="M50 5 L88 95 L50 75 L12 95 Z"/> </svg>,

iconSize:[24,24],
iconAnchor:[12,12]

});

gpsBtn.addEventListener(‘click’,()=>{

if(!following){

following=true;

gpsBtn.classList.remove(‘error’);
gpsBtn.classList.add(‘following’);

watchId=
navigator.geolocation.watchPosition(

(pos)=>{

const lat =
pos.coords.latitude;

const lng =
pos.coords.longitude;

const altitude =
pos.coords.altitude;

if(altitude !== null){

altitudeLabel.innerText =
‘標高 ’ +
Math.round(altitude) +
’ m’;

}

if(!marker){

marker =
L.marker(
[lat,lng],
{
icon:userIcon
}
).addTo(map);

markerElement =
marker.getElement();

}else{

marker.setLatLng(
[lat,lng]
);

}

if(markerElement){

markerElement.style.transform =
rotate(${heading}deg);

}

if(following){

map.setView(
[lat,lng]
);

}

},

(err)=>{

gpsBtn.classList.remove(
‘following’
);

gpsBtn.classList.add(
‘error’
);

following=false;

alert(
‘位置情報取得に失敗しました’
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
‘following’
);

if(watchId){

navigator.geolocation.clearWatch(
watchId
);

}

}

});

// ドラッグで追従解除

map.on(‘dragstart’,()=>{

if(following){

following=false;

gpsBtn.classList.remove(
‘following’
);

if(watchId){

navigator.geolocation.clearWatch(
watchId
);

}

}

});

// コンパス

compassBtn.addEventListener(
‘click’,
async ()=>{

if(compassEnabled){

compassEnabled=false;

compassBtn.classList.remove(
‘compass-on’
);

return;

}

try{

if(
typeof DeviceOrientationEvent !==
‘undefined’ &&
typeof DeviceOrientationEvent
.requestPermission ===
‘function’
){

const permission =
await DeviceOrientationEvent
.requestPermission();

if(permission !== ‘granted’){

alert(
‘コンパス許可が必要です’
);

return;

}

}

window.addEventListener(
‘deviceorientation’,
(event)=>{

if(event.webkitCompassHeading){

heading =
event.webkitCompassHeading;

}else if(event.alpha !== null){

heading =
360 - event.alpha;

}

if(markerElement){

markerElement.style.transform =
rotate(${heading}deg);

}

}
);

compassEnabled=true;

compassBtn.classList.add(
‘compass-on’
);

}catch(e){

compassBtn.classList.add(
‘error’
);

alert(
‘コンパス取得失敗’
);

}

});
