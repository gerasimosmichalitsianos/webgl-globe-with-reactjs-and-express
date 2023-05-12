import React, { useState } from 'react';
import './App.css';
import * as d3 from 'd3';
import Globe from 'globe.gl';
import Header from './components/Header';
import Footer from './components/Footer';
import World from './components/World';
import Button from './components/Button';

export function App() {

  function str2array(arrstr) {
    return String(arrstr).trim().split(",").map(Number);
  }

  // function to return color based on Brightness Temperature (BT) value
  // *******************************************************************
  function getColor(value){                                                                                               
    if( value < 265.0 ) {                                                                                                 
      return colors[0]; // navy                                                                                           
    } else if( value >= 265.0 && value < 270.0 ) {                                                                        
      return colors[1]; // blue                                                                                           
    } else if( value >= 270.0 && value < 275.0 ) {                                                                        
      return colors[2]; // cyan/aqua                                                                                      
    } else if( value >= 275.0 && value < 280.0 ) {                                                                        
      return colors[3]; // lime                                                                                           
    } else if( value >= 280.0 && value < 285.0 ) {                                                                        
      return colors[4]; // yellow                                                                                         
    } else if( value >= 285.0 && value < 290.0 ) {                                                                        
      return colors[5]; // orange                                                                                         
    } else if( value >= 290.0 && value < 295.0 ) {                                                                        
      return colors[6]; // red                                                                                            
    } else if( value >= 295.0 && value < 300.0 ) {                                                                        
      return colors[7]; // dark red                                                                                       
    } else {                                                                                                              
      return colors[8]; // magenta                                                                                        
    }                                                                                                                     
  }  

  // state to set lat-lon string
  // ***************************
  const [ colors, setColors ] = useState(["#000080","#0000FF",
    "#00FFFF","#00FF00","#FFFF00","#FFA500","#FF0000","#FF00FF"]);
  const noData = -999.0;
  const weightColor = d3.scaleSequentialSqrt(d3.interpolateYlOrRd)                                                  
    .domain([0, 1e7]);                                                                                              
 
  // define function to fetch JSON outputted from server-side
  // Javscript
  // ********************************************************
  const getSqliteData = async () => {
    try {
      const response = await fetch("http://localhost:8000/sqlite");
      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      return { success: false, data: null };
    }
  }

  (async () => {
    let res = await getSqliteData();
    if(res.success) {
      plotBrightnessTemperatures(res.data);
    }
  })(); // these empty parentheses () basically 
        // just calls this (unnamed) anonymous async function just defined

  function plotBrightnessTemperatures(sqliteData) {    

    // convert strings to get 3 arrays of BTs, latitudes,longitudes
    // ************************************************************
    let bts = str2array(sqliteData.bt)
    let lngs = str2array(sqliteData.lng);
    let lats = str2array(sqliteData.lat);

    if ( bts.length>1 ) {
      // create array of objects
      // ***********************
      const bt_objs = [];
      for( let count = 0; count<bts.length; count++ ) {
        if( bts[count]<0.0 ) continue;
        if( lngs[count] == noData ) continue;
        if( lats[count] == noData ) continue;
        bt_objs.push(
          {'lat':lats[count],'lng':lngs[count],'size':0.0,'color':getColor(bts[count])});
        if(count%2 == 0) continue; // skip even points to increase performance of the page
      }

      // plot BTs on globe object
      // ************************
      const world = Globe()                                                                                             
        (document.getElementById('world_globe'))                                                                        
        .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .pointsData(bt_objs)
        .pointAltitude('size')
        .pointColor('color')
        .onGlobeClick( 
          e => {
            document.getElementById(
              "location").innerHTML = "Latitude: "+e.lat+", Longitude: "+e.lng;
          }
        );
    }
  }

  return (
    <div className="App">
      <Header />
      <p id="location">Latitude: 0.0, Longitude:0.0</p>
      <Button setColors={setColors} colors={colors} />
      <World /> 
      <Footer />
    </div>
  );
}
export default App;
