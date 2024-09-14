const apiKey = gon.map_api_key
console.log(mypathValues);
let map;
let drawingManager;
let placeIdArray = [];
let polylines = [];
var snappedPolylines = [];
let snappedPathvalues = [];
let editPathValues = [];
let snappedCoordinates = [];
var start_button = document.getElementById('start');
var dottedPolyline = null;
let mypathValues = gon.mypathValues;
let isPolylineSelected = false;
const input = document.getElementById("pac-input");
const searchBox = new google.maps.places.SearchBox(input);
const buttonOpen = document.getElementById('modalOpen');
const modal = document.getElementById('easyModal');
const buttonClose = document.getElementsByClassName('modalClose')[0];
// なんだこの量...

function initialize() {
  let mypathValues = gon.mypathValues;
  let mapOptions = {
    zoom: 16,
    center: {lat: 35.661796, lng: 139.697436},
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  start_button.style.display = 'block';
  
  if (mypathValues != null) {
      for ( let i = 0; i < mypathValues.length; i++) {
        let snappedCoordinates = mypathValues[i];
        drawSnappedPolyline(snappedCoordinates);
      }
  }

  // 検索バーを右上に表示
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(
      document.getElementById('bar'));
  let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autoc'));
  autocomplete.bindTo('bounds', map);
  autocomplete.addListener('place_changed', function() {
    let place = autocomplete.getPlace();
    map.fitBounds(place.geometry.viewport);
    if (place.geometry.viewport) {
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  });

  // 描画ツールの設定
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: false,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYLINE
      ]
    },
    polylineOptions: {
      strokeColor: '#696969',
      strokeWeight: 2,
      strokeOpacity: 0.3,
    }
  });
  drawingManager.setMap(map);
  
  // ポリラインを描画したらsnapToRoadを実行
  // poly=ポリライン、path=ポリラインの座標
  drawingManager.addListener('polylinecomplete', function(poly) {
    const path = poly.getPath();
    polylines.push(poly);
    placeIdArray = [];
    runSnapToRoad(path);
  });

  start_button.addEventListener('click', function() {
    start_button.style.display = 'none';
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    let completeButton;
    if (!completeButton) { // 完了ボタンあれば表示しない
      showCompleteButton();
    }
  });

// ボタンがクリックされた時
buttonOpen.addEventListener('click', modalOpen);
function modalOpen() {
  modal.style.display = 'block';
}

// バツ印がクリックされた時
buttonClose.addEventListener('click', modalClose);
function modalClose() {
  modal.style.display = 'none';
}

// モーダルコンテンツ以外がクリックされた時
addEventListener('click', outsideClose);
function outsideClose(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}
}

function showCompleteButton() {
    const complete = document.getElementById('complete');
    complete.style.display = 'block';

    complete.addEventListener('click', completed);
}

function completed() {
  alert('完了しました');
  drawingManager.setDrawingMode(null);
  const complete = document.getElementById('complete');
  complete.style.display = 'none';
  complete.removeEventListener('click', completed);
  if (dottedPolyline) {
    dottedPolyline.setMap(null);
    dottedPolyline = null;}
  }

// ポリラインをAPIに投げて実際の道路にスナップさせ、描画
// getAtでLatLngを取得, toUrlValueで緯度経度を文字列に変換
function runSnapToRoad(path) {
  var pathValues = [];
  for (var i = 0; i < path.getLength(); i++) {
    pathValues.push(path.getAt(i).toUrlValue());
  }
  fetch(`https://roads.googleapis.com/v1/snapToRoads?interpolate=true&key=${apiKey}&path=${pathValues.join('|')}`)
    .then(response => response.json())
    .then(data => {
      processSnapToRoadResponse(data);
      drawSnappedPolyline(snappedCoordinates);
      start_button.style.display = 'block';
      savePolylines(snappedPolyline);
      snappedPolylines.push(snappedPolyline);
      clearPolyline();
    });
}

// ポリラインをAPIに投げた結果を処理
function processSnapToRoadResponse(data) {
  snappedCoordinates = [];
  placeIdArray = [];
    for (var i = 0; i < data.snappedPoints.length; i++) {
      var latlng = new google.maps.LatLng(
          data.snappedPoints[i].location.latitude,
          data.snappedPoints[i].location.longitude);
      snappedCoordinates.push(latlng);    
  };
}

//　スナップされたポリラインを描画 
function drawSnappedPolyline(snappedCoordinates) {
    snappedPolyline = new google.maps.Polyline({
    path: snappedCoordinates,
    strokeColor: '#4169e1',
    strokeWeight: 7,
    strokeOpacity: 0.6,
    clickable: true,
  });

  snappedPolyline.setMap(map);
  if (dottedPolyline) {
    dottedPolyline.setMap(null);
    dottedPolyline = null;
  }

  google.maps.event.addListener(snappedPolyline, 'click', function(event) {
    if (isPolylineSelected) {
      return;
    }
    isPolylineSelected = true;

    let editPathValues = [];

    let path = this.getPath();
    for (let i = 0; i < path.getLength(); i++) {
      editPathValues.push(path.getAt(i));
    }
    const lineSymbol = {
      path: "M 0,-1 0,1",
      strokeColor: '#ff4500',
      strokeOpacity: 0.8,
      scale: 4,
    };
    dottedPolyline = new google.maps.Polyline({
      path: editPathValues,
      strokeOpacity: 0,
      icons: [
        {
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        },
      ]
    });
    this.setMap(null);
    dottedPolyline.setMap(map);


    start_button.style.display = 'none';
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    let completeButton;
    if (!completeButton) {
      showCompleteButton();
    }
    deleteOldPath(editPathValues);
    isPolylineSelected = false;
});
}

function deleteOldPath(editPathValues) {
  fetch('/route', {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify(editPathValues),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
  .catch(error => console.error('Error:', error));
}

function clearPolyline() {
  for (var i = 0; i < polylines.length; ++i) {
    polylines[i].setMap(null);
  }
  polylines = [];
  return false;
}

function savePolylines(snappedPolyline) {
  let snappedPath = snappedPolyline.getPath();
  for(let i = 0; i < snappedPath.getLength(); i++) {
      snappedPathvalues.push(snappedPath.getAt(i));
  }
  fetch('/route', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify(snappedPathvalues),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
  .catch(error => console.error('Error:', error));
}

// ページ読み込み時にinitializeを実行
window.addEventListener('turbo:load', function(){
  window.setTimeout(initialize, 200);
});
