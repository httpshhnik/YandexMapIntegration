(function(){
    //ymaps.ready(init); //!!!! 2 maps will be created
    var myMap;

    function init() {
        //SuggestView options.boundedBy parameters.options.boundedBy
        myMap = new ymaps.Map('map', {
            // center: [48.015877, 37.802850],
            center: [48, 38],
            zoom: 8,
            controls: ['zoomControl']
        }, {
            searchControlProvider: 'yandex#map'
        });

        
        console.dir(myMap);

        var searchControl = new ymaps.control.SearchControl({
            options: {//https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.SearchControl-docpage/
                // Заменяем стандартный провайдер данных (геокодер) нашим собственным.
                noCentering: false,
                noSuggestPanel: false,
                //noSelect: true,
                noPlacemark: true,
                resultsPerPage: 10,
                
                // fitMaxWidth:true,
                strictBounds:new ymaps.Rectangle([
                    // Setting the coordinates of the diagonal corners of the rectangle.
                    [47.8, 37.5],
                    [48.4, 38]
                    ///**/ typeof id_153425669178416074304 === 'function' && id_153425669178416074304({"status":"success","data":{"type":"FeatureCollection","properties":{"ResponseMetaData":{"SearchRequest":{"request":"пл победы","results":10,"skip":0,"boundedBy":[[37.04842675,55.43644829],[38.17590226,56.04690124]]},"SearchResponse":{"found":0,"SourceMetaDataList":{"SourceMetaData":{"GeocoderResponseMetaData":{"request":"пл победы","found":0,"results":10,"InternalResponseInfo":{"accuracy":0,"mode":"geocode","version":"18.08.14-1"}}},"GeocoderResponseMetaData":{"request":"пл победы","found":0,"results":10,"InternalResponseInfo":{"accuracy":0,"mode":"geocode","version":"18.08.14-1"}}},"InternalResponseInfo":{"display":"single","context":"ZAAAAAgAEAAaKAoSCQAAAAAAkHZAEQAAAAAAoGZAEhIJAAAAAAAA8L8RAAAAAAAA8L8iAQAoyAEwATiR+7mNnYK28zpA/v//////////AUgBVQAAgL9Y////////////AWoCcnVwAJ0B7FG4PaABAKgBAA==","reqid":"1534256696075567-988330053-vla1-4012","serpid":"1534256696075567-988330053-vla1-4012"},"display":"single","context":"ZAAAAAgAEAAaKAoSCQAAAAAAkHZAEQAAAAAAoGZAEhIJAAAAAAAA8L8RAAAAAAAA8L8iAQAoyAEwATiR+7mNnYK28zpA/v//////////AUgBVQAAgL9Y////////////AWoCcnVwAJ0B7FG4PaABAKgBAA=="}}},"features":[]}});
                ])
                //https://yandex.ru/blog/mapsapi/strictbounds-v-searchcontrol-ne-rabotaet
                // noPopup:true,
                // noSelect:true
                //https://api-maps.yandex.ru/services/search/v1/?callback=id_149733611298987634388&format=json&lang=ru_RU&token=undefined&rspn=1&results=20&origin=jsapi2SearchControl&snippets=businessrating%2F2.x%2Cmasstransit%2F1.x&ask_direct=1&text=%D0%A8%D0%BE%D0%BA%D0%BE%D0%BB%D0%B0%D0%B4%D0%BD%D0%B8%D1%86%D0%B0&ll=37.597295804584526%2C55.7636625431712&spn=0.0046402215957854764%2C0.0013942952844061551&sign=3512325313
            }
        });
        
        // searchControl.SearchControl(parameters.options.fitMaxWidth,true);
        // searchControl.SearchControl(parameters.options.boundedBy,);

//todo https://tech.yandex.ru/maps/doc/archive/jsapi/2.0/ref/reference/geolocation-docpage/
        
        // searchControl.events.add('clear', function (e) {alert('clear');console.log(e);});
        // searchControl.events.add('error', function (e) {alert('error');console.log(e);});
        // searchControl.events.add('load', function (e) {
        //     var t = "Украина, Донецк, "+ searchControl._yandexState._model.request;
        //     e.originalEvent.request = t;
        //     searchControl._yandexState._model.request = t;
        //     alert('load');console.log(e);
        //     console.dir(searchControl);
        // });
        // searchControl.events.add('optionschange', function (e) {//too late
            // var t = "Украина, Донецк, "+ e.originalEvent.target.state._data.inputValue;
            // console.log('optionschange');
            // console.log(e);
            // console.dir(searchControl); console.dir(e);
            // e.originalEvent.target.state._data.inputValue = t;
            // e.originalEvent.target.state._data.originalRequest = t;
            // e.originalEvent.target.state._data.request = t;
            // console.dir(e);//.target.state._data.inputValue
        // });
        
        //searchControl.events.add('parentchange', function (e) {console.log('parentchange');console.log(e);});
        
        // searchControl.events.add('resultselect', function (e) {console.log('resultselect');console.log(e);});
        // searchControl.events.add('resultshow', function (e) {console.log('resultshow');console.log(e);});
        
        // searchControl.events.add('submit', function (e) {console.log('submit');console.log(e);
        //     var t = "Украина, Донецк, "+ e.originalEvent.request;
        //     e.originalEvent.request = t;
        //     searchControl._yandexState._model.request = t;

        //     console.dir(searchControl); console.dir(e);
        // });

        // searchControl.events.add('optionschange', function (e) {
        //     // e.originalEvent.request = "Украина, Донецк, "+ e.originalEvent.request;
        //     console.dir(e);
        // });
        // searchControl.events.add('load', function (event) {
        //     // Проверяем, что это событие не "дозагрузки" результатов и
        //     // по запросу найден хотя бы один результат.
            
        //     if (!event.get('skip') && searchControl.getResultsCount()) {
        //         searchControl.showResult(0);
        //     }
        // });
        myMap.controls.add(searchControl, { //todo remove?
            right: 10,
            top: 10
        });
        // Создаем коллекцию.
        var myCollection = ymaps.geoQuery(getData());
        myMap.geoObjects.add(myCollection.clusterize());
        
        // searchControl.events.add('mapchange', function (event) { console.log('mapchange'); });

        searchControl.events.add('resultshow', function (event) {
            // console.log('resultshow');
            // console.dir(myMap);
            // console.dir(arguments);
            var myId = event.get('index');
            if (searchControl.getResultsCount()) {
                var geoObjectsArray = searchControl.getResultsArray();
                if (geoObjectsArray.length) {
                    var myPoint = myCollection.getClosestTo(geoObjectsArray[myId], 500);
                    myPoint.balloon.open();
                }
            }
        }, this);
    } //init

    ymaps.ready(init);
})();