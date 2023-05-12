import React,{useState} from 'react';
function Button(props) {

  // define state to give name to colors being used
  // **********************************************  
  const [ colorScale, setColorScale ] = useState("Rainbow"); 
  
  // update colors name on button
  // ****************************
  function changeColors() {
    if( colorScale === "Rainbow" ) {
      setColorScale("Grayscale");
      // black to white with some shades of gray in middle
      let colors = ["#696969","#808080","#A9A9A9","#C0C0C0","#D3D3D3","#DCDCDC","F5F5F5","#FFFFFF"];
      props.setColors(colors);
    } else {
      setColorScale("Rainbow");
      let colors = ["#000080","#0000FF","#00FFFF","#00FF00","#FFFF00","#FFA500","#FF0000","#FF00FF"];
      props.setColors(colors);
    } 
 
  }

  return (
    <div id="buttonDiv">
      <button onClick={changeColors}>{colorScale}</button>
    </div>
  );
}
export default Button;
