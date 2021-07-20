<template>
  <div>
    <div>
      <h2>Vue Js Search and Add Marker</h2>

      <label>
        <gmap-autocomplete @place_changed="initMarker"></gmap-autocomplete> -->

       <button @click="addLocationMarker">Add</button>
        <input  v-model="address_search" type="search" placeholder="住所を入力"><input type="button" value="追加" @click="getlatlng()">
      </label>
      <br/>

    </div>
    <br>
    <gmap-map
        :zoom="14"
        :center="center"
        style="width:100%;  height: 600px;"
      >
      <gmap-marker
        :key="index"
        v-for="(m, index) in locationMarkers"
        :position="m.position"
        @click="center=m.position"
        @dragend="gMapFunc($event.latLng)"

      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "AddGoogleMap",
  data() {
    return {
      center: {
        lat: 39.7837304,
        lng: -100.4458825
      },
      locationMarkers: [],
      locPlaces: [],
      existingPlace: null,
      address_search: "",

    };
  },

  mounted() {
    this.locateGeoLocation();
  },

  methods: {
    initMarker(loc) {
      this.existingPlace = loc;
    },
    addLocationMarker() {
      if (this.existingPlace) {
        const marker = {
          lat: this.existingPlace.geometry.location.lat(),
          lng: this.existingPlace.geometry.location.lng()
        };
        this.locationMarkers.push({ position: marker });
        this.locPlaces.push(this.existingPlace);
        this.center = marker;
        this.existingPlace = null;
      }
    },
    locateGeoLocation: function() {
      navigator.geolocation.getCurrentPosition(res => {
        this.center = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };
      });
    },
      gMapFunc(evnt) {
        this.jdata = {"geo": {"lat":evnt.lat(), "lng":evnt.lng()}};
      },
    getlatlng(){
      let adrs = this.address_search;
      if (adrs.length) {
        var rslts = this.adrs_list;
        var geocoder = new google.maps.Geocoder();
        // 第１引数はGeocoderRequest。住所⇒緯度経度座標の変換時はaddressプロパティを入れればOK。
        // 第２引数はコールバック関数。
        geocoder.geocode({
          address: adrs
        }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0].geometry) {
              // 緯度経度を取得
              var latlng = results[0].geometry.location;
              // 住所を取得(日本の場合だけ「日本, 」を削除)
              var address = results[0].formatted_address.replace(/^日本、/, '');
              rslts.push({address: address, latlng: latlng});

              var Options = { zoom: 12, center: latlng, mapTypeId: 'roadmap' };
              var map = new google.maps.Map(document.getElementById('gmap'), Options);

              for(let i in rslts){
                let marker = new google.maps.Marker({
                  position: rslts[i].latlng,
                  map: map
                });

                let infoWindow = new google.maps.InfoWindow({
                  content: rslts[i].address + '<br />' + rslts[i].latlng.toString()
                });
                marker.addListener('click', function() {
                infoWindow.open(map, marker);
                });
              }

            }
          } else {
            console.log("Geocodingに失敗しました。。。");
          }
        });
      }
    }
  }
};
</script>