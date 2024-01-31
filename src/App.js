import './App.css';
import React, { Component } from 'react';
import ParticlesBg from 'particles-bg'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
// import Clarifai from 'clarifai'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


class App extends Component {
constructor() {
  super();
  this.state={
    input:'',
    imageURL: '',
    box:{},
    route:'signin',
    isSignedIn: false,
  }
}

calculateFaceDistance = (data1) =>{
    const clarifaiFace = data1.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('image')
    const width = Number(image.width)
    const height = Number(image.height)
    console.log(clarifaiFace , image.height , this.state.box );

    const topRow = clarifaiFace.top_row;
    const leftCol = clarifaiFace.left_col;
    const bottomRow = clarifaiFace.bottom_row;
    const rightCol = clarifaiFace.right_col;

return{
  leftCol: leftCol * width,
  topRow: topRow * height,
  rightCol: width - (rightCol * width),
  bottomRow: height - (bottomRow * height)
  }
}

displayFaceBox=(box)=>{
  this.setState({box: box});
 
}

onInputChange=(event)=>{
 this.setState({input: event.target.value})
}

onButtonSubmit =()=>{
  this.setState({imageURL: this.state.input})
  

  

const PAT = 'eb93bbc2c8394089b01aaf0321da6d21';
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
const IMAGE_URL = this.state.input;

const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                    // "base64": IMAGE_BYTES_STRING
                }
            }
        }
    ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};


fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => {

      this.displayFaceBox(this.calculateFaceDistance(result))

    })
    .catch(error => console.log('error', error));

}

onRouteChange=(route)=> {
  if(route === 'signout'){
    this.setState({isSignedIn: false})
  }else if(route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}
 

  render() {

    const {box , imageURL , isSignedIn , route } = this.state

    let config = {
      num: [4, 7],
      rps: 0.1,
      radius: [5, 40],
      life: [1.5, 3],
      v: [2, 3],
      tha: [-40, 40],
      alpha: [0.6, 0],
      scale: [1, 0.1],
      position: "all", 
      color: ["#1ed683", "blue"],
      cross: "dead", 
      random: 15,  
      g: 5,  
    
      onParticleUpdate: (ctx, particle) => {
          ctx.beginPath();
          ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.closePath();
      }
    };
  

    return (
    <div className="App">
      <ParticlesBg  num={200} type="custom" config={config} bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
    { route === 'home' 
      ? <div>
      <Logo/>
      <Rank/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition box={box} imageURL={imageURL}/>
    </div>  
      : (
        route === "signin"
        ? <SignIn onRouteChange={this.onRouteChange}/>
        : <Register onRouteChange={this.onRouteChange}/>
      )
      
    
      }
    </div>
  );
}
}
export default App;
