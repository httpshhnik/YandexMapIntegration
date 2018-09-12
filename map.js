var debug = false;
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
/////////////////step 2 wifi zones
//http://www.matrixhome.net/scripts/get_cords.php     wifi  var jsonObj
//todo сделать прозрачные цвета,    внешние зоны, точки источника с картинкой

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
function draw(event) {
    
    if(debug)return;
    
    console.log('DrawBaloon '+loading);
    if(
      searchIndex==0 && loading==4||
       searchIndex==1 && loading==1
     ){//if newLocation
console.log('DrawPath ');
        searchIndex=-1;
        try{
        //searchControl.showResult(0);//balloon?

        //myCollection.getClosestTo(myMap.getCenter()).balloon.open();
        var p = myMap.getCenter();
        var point = myCollection.getClosestTo(p);
        
            
            track.call(myMap,p,point);
            // myMap.getCenter().balloon.open();
            point.balloon.open();
            console.log(Date());
        }catch(excp){

        }
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
      //console.log('myMap.actionend1 ');
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
//console.log('loco yandex');

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
    if(!debug)
    myMap.geoObjects.add(myCollection.clusterize());

    if(!debug)
    myMap.controls.add(searchControl);
    searchControl.state.set('inputValue', initVal)

    if(debug)
     exec();
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

var lastValid;
function reverse(p){
    var _p = [];
    
    _p[0] = p[1];
    _p[1] = p[0];
    //console.log(p);
    if(_p[0]<10 || _p[1]<10
    //||_p[0]==48 || _p[1]==48//TODO fix WTF far point wifi.mess[33].zone
    )return lastValid;  //TODO fix crutch, data error  wifi.mess[14].zone last element = 4   , huge lines to nowhere
    lastValid = _p;
    return _p;
}
function poly(arr,mes,style,mark) {
    //var arr = [[37.79080661274975,47.99166034834581],[37.7910855624873,47.99167470864984],[37.79119821526592,47.99179677107283],[37.791117748995475,47.99203371495209],[37.7908334348399,47.9924142589056],[37.79074223973339,47.99262247988098],[37.79078515507763,47.99273736005947],[37.79072078206127,47.9927804400605],[37.79068323113506,47.992801980047496],[37.79054912068432,47.99276967006361],[37.79032381512707,47.99276608006414],[37.79019506909435,47.992801980047496],[37.790093145151786,47.992873779939266],[37.78998049237316,47.992884549914415],[37.78974982239788,47.99289172989661],[37.78950305916851,47.99285941996891],[37.78928311802929,47.99276249006445],[37.78917046525066,47.99268710001285],[37.78906317689007,47.992572219722476],[37.78903099038189,47.99241066888141],[37.78906317689007,47.992285017877585],[37.78918655850475,47.99219526697323],[37.789851746340446,47.99206961544494],[37.79018434025829,47.991854212113175],[37.79080661274975,47.99166034834581]];
    //console.log(arr);
    arr = arr.substring(9,arr.length-9);
    arr = arr.substring(0,arr.length-2);
    arr = arr.split(',');
    console.log(arr[0]);
    
    

    //console.log(arr);
    

    for(i=0;i<arr.length;i++){
        arr[i] = reverse(arr[i].split(' '));
    }
    if(style == '1')
    myMap.geoObjects
        .add(new ymaps.Placemark(
            mark
            , {
            balloonContent: mes,
            hintContent: mes,
            balloonContent: mes
        }, {
            //preset: 'islands#icon',
            //iconColor: '#0095b6'
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'ico.png',
            // Размеры метки.
            iconImageSize: [40, 40],
        }));

        arr = arr.splice(0,arr.length-1);//убираем артефакты

    // Создаем многоугольник, используя вспомогательный класс Polygon.
    var myPolygon = new ymaps.Polygon([
        // Указываем координаты вершин многоугольника.
        // Координаты вершин внешнего контура.
        arr
        //[
            //[47.5, 37.3], [48.5, 38.2] //switch coords()
         // 
        //],
        // // Координаты вершин внутреннего контура.
        // [
        //     [55.75, 37.52],
        //     [55.75, 37.68],
        //     [55.65, 37.60]
        // ]
    ], {
        // Описываем свойства геообъекта.
        // Содержимое балуна.
        hintContent: "Многоугольник"
    }, {
        // Задаем опции геообъекта.
        // Цвет заливки.
        fillColor: style=='1'?'#00FF0088':"#ffff00",
        strokeColor: style=='1'?'#00FF0088':"#ffff00",
        // Ширина обводки.
        strokeWidth: 1,
        opacity: 0.5,
    });
    //console.dir(myPolygon);
    // Добавляем многоугольник на карту.
    
    myMap.geoObjects.add(myPolygon);
    
    
}
function exec(){
    var r = wifi.mess.length;
    for(var i=0;i<r;i++)
    poly(
        wifi.mess[i].zone,
        wifi.mess[i].name,
        wifi.mess[i].style,
        [wifi.mess[i][3],wifi.mess[i][2]]
    );
    // for(var i=0;i<r/2-1;i++)
    // poly(wifi.mess[i].zone,wifi.mess[i].name);
    // for(var i=r/2-1;i<r;i++)
    // poly(wifi.mess[i].zone);
}

function test(){
    myMap.geoObjects
        .add(new ymaps.Placemark([55.684758, 37.738521], {
            balloonContent: 'цвет <strong>воды пляжа бонди</strong>'
        }, {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        }));
}