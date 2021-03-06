import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from "./components/Home"
import Loading from "./components/Loading"
import Upload from "./components/Upload"
import Error from "./components/Error"
import Photographer from "./components/Photographer"
import Results from "./components/Results"
import Requests from "./components/Requests"
import Pending from "./components/Pending"
import Select from "./components/Select.js"
import Messages from "./components/Messages.js"
import ReqPhotographer from './components/ReqPhotographer';
const axios = require("axios");


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
     user: {},
     match:[],
     labels:[],
     username:"",
     fireRedirect:false,
     photographerMatch:"",
     connected:false,
     del:false
    };
  }

  setRedirectUpload= (labels, match) => {
    this.setState({
      labels:labels,
      match:match,
      fireRedirect:false,
  })
  }
  onClickMatch = (photographer,e)=>{
    this.setState({photographerMatch:photographer })
    // axios.post("/collab",{
    // }).then((response) => {
    //       this.setState({user:response.data[0],fireRedirect:true})

  // })
  }

  handleChange = event => {
    this.setState({
      username: event.target.value
    });
  }



  onLogin = (e) =>{
    e.preventDefault();
    var username = this.state.username
    axios.post("/login",{
      username:username.trim()
    }).then((response) => {
          this.setState({user:response.data[0],fireRedirect:true})

  })
}
onClickMessage = ()=>{
  this.setState({
    fireRedirect:true,
    connected:true
  }) 

  console.log("photomatch", this.state.photographerMatch)
  axios.post("/collab", {
   photographer:this.state.photographerMatch.id, 
   influencer:this.state.user.id 
  }).then((response) => {
    console.log(response.data)
    

})
     
}

accept = ()=>{
  this.setState({
    connected:true
  }) 
     
}


delete = (request,e) =>{
  this.setState({
    fireRedirect:true,
    del:true
 
  }) 

  axios.post("/decline", {
   influencer:request,
   photographer:this.state.user.id 
  }).then((response) => {
    console.log(response.data)
  
})
}


  render() {
    return (

      <BrowserRouter>
      <Switch>
        <Route path="/" render={(props) => <Home  handleChange={this.handleChange} onLogin={this.onLogin} fireRedirect = {this.state.fireRedirect} user = {this.state.user}/>} exact/>
        <Route path="/select"  component={Select} />
        <Route path="/reqPhotographer" render={(props)=> <ReqPhotographer connected = {this.state.connected}  onClickMessage={this.onClickMessage} fireRedirect={this.state.fireRedirect} user = {this.state.user}  photographerMatch={this.state.photographerMatch}/>} />
        {/* <Route path="/loading" render={(props) => <Loading user ={this.state.user} />}  /> */}
        <Route path="/upload"render={(props) => <Upload  setRedirectUpload ={this.setRedirectUpload} user = {this.state.user} match={this.state.match} labels={this.state.labels} fireRedirect={this.state.fireRedirect} />} />
        <Route path="/photographer" render={(props) => <Photographer user = {this.state.user}/>} />
        <Route path="/results" render={(props)=> <Results   connected = {this.state.connected} onClickMessage={this.onClickMessage} user = {this.state.user} photographerMatch={this.state.photographerMatch} onClickMatch={this.onClickMatch} />} />
        <Route path="/requests" render={(props)=> <Requests del = {this.state.del} onClickMessage={this.onClickMessage} accept={this.accept} delete={this.delete} user = {this.state.user} connected={this.state.connected} />}  />
        <Route path="/pending" render={(props)=> <Pending user = {this.state.user} />}  />
        <Route path="/messages" render={(props)=> <Messages user = {this.state.user} />} />
        <Route component={Error} />
      </Switch>
      </BrowserRouter>

    );
  }
}

export default App;
