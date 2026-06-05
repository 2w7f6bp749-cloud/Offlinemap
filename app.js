const map = L.map('map');

const standard = L.tileLayer(
'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
{
maxZoom:18,
attribution:'国土地理院'
}
);

const topo = L.tileLayer(
'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png',
{
maxZoom:15,
opacity:0.45
}
);

standard.addTo(map);

map.setView(
[42.85,140.65],
10
);

let topoVisible = false;

document
.getElementById('layerBtn')
.addEventListener('click',()=>{

if(topoVisible){

map.removeLayer(topo);
topoVisible=false;

}else{

topo.addTo(map);
topoVisible=true;

}

});

let marker=null;
let watchId=null;
let following=false;

const gpsBtn =
document.getElementById('gpsBtn');

gpsBtn.addEventListener('click',()=>{

if(!following){

following=true;

gpsBtn.classList.add('following');

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
radius:8
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
alert(
'位置情報を取得できません'
);
}
);

}else{

following=false;

gpsBtn.classList.remove(
'following'
);

navigator.geolocation.clearWatch(
watchId
);

}

});
