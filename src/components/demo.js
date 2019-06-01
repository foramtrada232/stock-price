import React, { Component } from 'react';
import "material-components-web/dist/material-components-web.min.css";
import './apod.css';

class apod extends Component{

state = {active:false};
constructor(props){
super(props)

this.state = {
array: undefined,
isLoaded: false,
}
}

componentDidMount(){
fetch("https://api.nasa.gov/planetary/apod?api_key=xhrfa56HkJT1KaOvi7fCWcN1sCAJM9eyDJp5zWrU")
.then(res => res.json())
.then(res => {
// console.log(res);
var data = res;
this.setState({
isLoaded: true,
array: data
})
// console.log(this.state.array);	
})
}

render (){
const { isLoaded,array } = this.state;
// console.log("DATA of apod======>",this.state.array);
if (!isLoaded) {
return (
<center><div class="loader"></div></center>
)
}
else if(isLoaded && array.media_type == "image"){
return(
<div class="apod_page">
<div class="mdc-layout-grid">
<div class="mdc-layout-grid__inner content">
<div class="mdc-layout-grid__cell--span-4">
<div class="apod_image"><img src={array.hdurl}></img></div>
</div>
<div class="mdc-card demo-card mdc-layout-grid__cell--span-8" id="card_content">
<h2 class="heading">{array.title}</h2>
<p class="para"><b>Description: </b>{array.explanation}</p>
<div id="artical_by"><b> &copy; {array.copyright}</b></div>
</div>
</div>
</div>
</div>
);
}
else{
return(
<div>
<h2>Sorry no data found</h2>
</div>
);
}
}
}

export default apod;