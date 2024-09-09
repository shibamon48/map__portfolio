const apiKey = gon.map_api_key

let map;
let drawingManager;
let placeIdArray = [];
let polylines = [];
let snappedCoordinates = [];

function initialize() {
  let mapOptions = {
    zoom: 17,
    center: {lat: -33.8667, lng: 151.1955,},
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // 検索バーを右上に表示
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
      document.getElementById('bar'));
  let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autoc'));
  autocomplete.bindTo('bounds', map);
  autocomplete.addListener('place_changed', function() {
    let place = autocomplete.getPlace();
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  });

  // 描画ツールの設定
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
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

  // // クリアボタンを押したら描画したポリラインを削除
  // document.getElementById('clear').addEventListener('click', function(event) {
  //   event.preventDefault();
  //   for (var i = 0; i < polylines.length; ++i) {
  //     polylines[i].setMap(null);
  //   }
  //   polylines = [];
  //   return false;
  // });
}

const start_button = document.getElementById('start');
start_button.addEventListener('click', function() {
  start_button.style.display = 'none';
  drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
  let completeButton;
  if (!completeButton) { // 完了ボタンあれば表示しない
    showCompleteButton();
  }

});

// 描画モードになったら完了ボタンを表示
function showCompleteButton() {
  completeButton = document.createElement('button');
  completeButton.textContent = '完了';
  completeButton.classList.add('btn');

  completeButton.addEventListener('click', function() {
    alert('完了しました');
    drawingManager.setDrawingMode(null);
    completeButton.remove();
  });

  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(completeButton);
}

// ポリラインをAPIに投げて実際の道路にスナップさせ、描画
function runSnapToRoad(path) {
  var pathValues = [];
  for (var i = 0; i < path.getLength(); i++) {
    pathValues.push(path.getAt(i).toUrlValue());
  }
  fetch(`https://roads.googleapis.com/v1/snapToRoads?interpolate=true&key=${apiKey}&path=${pathValues.join('|')}`)
    .then(response => response.json())
    .then(data => {
      processSnapToRoadResponse(data);
      drawSnappedPolyline();
      start_button.style.display = 'block';
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
      placeIdArray.push(data.snappedPoints[i].placeId);
  };
}

//　スナップされたポリラインを描画 
function drawSnappedPolyline() {
  var snappedPolyline = new google.maps.Polyline({
    path: snappedCoordinates,
    strokeColor: '#add8e6',
    strokeWeight: 4,
    strokeOpacity: 0.9,
  });

  snappedPolyline.setMap(map);
  polylines.push(snappedPolyline);
}

// ページ読み込み時にinitializeを実行
window.addEventListener('load', initialize);
