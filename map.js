// const promise = doSomething();
// const promise2 = promise.then(successCallback, failureCallback);
//todo пострить маршрут от объекта к терминалу
//https://tech.yandex.ru/maps/jsbox/2.1/geolocated_multiroute

//todo убрать таймеры и делать все по событиям
//где то возможно неправильно прописываются координаты

//оr another way, drawing?
//+добавить кнопку моя позиция
//todo в файле html не должно быть json.js
//todo на всю страницу http://jsfiddle.net/KW3U7/

// https://tech.yandex.ru/maps/jsbox/2.1/geolocated_multiroute
// https://tech.yandex.ru/maps/jsbox/2.1/multiroute_pedestrian



var initVal = '',
    initScale = 16; //пл победы 35а    таманский    пл ленина
var myMap;
var myCollection;
var searchControl;
var _event;
var gps;
var newPos = false;
var loading = 1;
var searchIndex = 0;

var multiRoute;
function draw(event) {//return;
    console.log('DrawBaloon '+loading);
    if(
      searchIndex==0 && loading==4||
       searchIndex==1 && loading==1
     ){//if newLocation
console.log('DrawPath ');
        searchIndex=0;

        //searchControl.showResult(0);//balloon?

        //myCollection.getClosestTo(myMap.getCenter()).balloon.open();
        var point = myCollection.getClosestTo(myMap.getCenter());
        track.call(myMap,myMap.getCenter(),point);
        // myMap.getCenter().balloon.open();
        point.balloon.open();
        console.log(Date());
  }
}

function init() {

    var geolocation = ymaps.geolocation;
    searchControl = new ymaps.control.SearchControl({
        options: { //parameters.options.boundedBy  parameters.options.strictBounds https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.SearchControl-docpage/
            noSuggestPanel: true,
            float: 'right',
            floatIndex: 100,
            noPlacemark: true, //запретить балун тру , но он все равно есть
            noSelect: false, //*

            noPopup: true, //пропадает список но и не показывает ближайшую точку
            noBalloon:true,
            noCentering: false, //*
            //.zoomMargin   noCentring=false
            strictBounds: new ymaps.Rectangle([ //yandex#search'
                // Setting the coordinates of the diagonal corners of the rectangle.
                [47.5, 37.3], //[47, 37]                 48 37.8
                [48.5, 38.2] //[49, 38]
                ///**/ typeof id_153425669178416074304 === 'function' && id_153425669178416074304({"status":"success","data":{"type":"FeatureCollection","properties":{"ResponseMetaData":{"SearchRequest":{"request":"пл победы","results":10,"skip":0,"boundedBy":[[37.04842675,55.43644829],[38.17590226,56.04690124]]},"SearchResponse":{"found":0,"SourceMetaDataList":{"SourceMetaData":{"GeocoderResponseMetaData":{"request":"пл победы","found":0,"results":10,"InternalResponseInfo":{"accuracy":0,"mode":"geocode","version":"18.08.14-1"}}},"GeocoderResponseMetaData":{"request":"пл победы","found":0,"results":10,"InternalResponseInfo":{"accuracy":0,"mode":"geocode","version":"18.08.14-1"}}},"InternalResponseInfo":{"display":"single","context":"ZAAAAAgAEAAaKAoSCQAAAAAAkHZAEQAAAAAAoGZAEhIJAAAAAAAA8L8RAAAAAAAA8L8iAQAoyAEwATiR+7mNnYK28zpA/v//////////AUgBVQAAgL9Y////////////AWoCcnVwAJ0B7FG4PaABAKgBAA==","reqid":"1534256696075567-988330053-vla1-4012","serpid":"1534256696075567-988330053-vla1-4012"},"display":"single","context":"ZAAAAAgAEAAaKAoSCQAAAAAAkHZAEQAAAAAAoGZAEhIJAAAAAAAA8L8RAAAAAAAA8L8iAQAoyAEwATiR+7mNnYK28zpA/v//////////AUgBVQAAgL9Y////////////AWoCcnVwAJ0B7FG4PaABAKgBAA=="}}},"features":[]}});
            ]),
        }
    });
    myMap = new ymaps.Map('map', {
        center: [48, 37.8],
        zoom: initScale,
        controls: ['zoomControl']
    }, {
        searchControlProvider: 'yandex#search' //search or map ???
    }); //yandex#search

    myMap.events.add('actionend', function () {
      console.log('myMap.actionend1 ');
      loading++;
      draw();
    });

    searchControl.events.add('submit',function(){
      console.log('SUBMIT');

      searchIndex=1;
      loading=0;
    });//2 times on search



    geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
    }).then(function (result) {
        // Красным цветом пометим положение, вычисленное через ip.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        result.geoObjects.get(0).properties.set({   balloonContentBody: 'Мое местоположение' });

        myMap.geoObjects.add(result.geoObjects); //фокус на меня мое местоположение моя позиция
console.log('loco yandex');

    }).then(function () {
        // console.log('zoom');
        // setTimeout(function () {
        //newPos=true;
            myMap.setZoom(15);
        // }, 400);
    });

    geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
    }).then(function (result) {
        // console.log('zoom2');
        // Зеленым цветом пометим положение, полученное через браузер.
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
        result.geoObjects.options.set('preset', 'islands#greenCircleIcon');
        myMap.geoObjects.add(result.geoObjects);
        //console.dir(result.geoObjects);
        gps = result.geoObjects.position;
        //console.log(gps);
        newPos = true;

    });

    myCollection = ymaps.geoQuery(getData());
    myMap.geoObjects.add(myCollection.clusterize());

    myMap.controls.add(searchControl);
    searchControl.state.set('inputValue', initVal)
}



function show(event) {//настройка масштаба тут
    if (!event.get('skip') && searchControl.getResultsCount()) {
        searchControl.showResult(0);
    }
}

function track(a,b) {
    // Задаём точки мультимаршрута.
    console.log("Track "+a);
    var pointA = a,pointB = b,
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [ pointA,pointB ],
            params: { routingMode: 'pedestrian'}//Тип маршрутизации - пешеходная маршрутизация.
        }, {// Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true
        });

    // Добавляем мультимаршрут на карту.
    this.geoObjects.add(multiRoute);
}


ymaps.ready(init);
