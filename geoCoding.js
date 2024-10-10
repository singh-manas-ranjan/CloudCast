import axios from "axios"
export async function fetchCoOrdinates(city){
    const res = await axios.get(' https://geocode.maps.co/search',{
        params : {
            q : city
        }
    })

    const {data : [{lat , lon , display_name}] } = res;
 

    return {
        name : display_name,
        latitude : lat,
        longitude : lon
    }
}

export async function fetchLocationName(lat, lon){
    const res = await axios.get('https://geocode.maps.co/reverse?',{
        params :{
            lat :lat,
            lon :lon,
            api_key:67080d5d20d96981564201oxkc7c68f
        }
    })

    const{data : {address : {city}}, } = res;

    return city;
}
