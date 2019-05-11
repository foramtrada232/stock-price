import React, { Component } from 'react';
import firebase from '../Firebase';
// import { Link } from 'react-router-dom';

class Login extends Component {

  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    // this.unsubscribe = null;
    this.state = {
      email: '',
      password: '',
      user: [],
      array:[],
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const user = [];
    querySnapshot.forEach((doc) => {
      const { userName, email, password, phone, address } = doc.data();
      user.push({
        key: doc.id,
        doc, 
        userName,
        email,
        password,
        phone,
        address,
        
      });
    });
    this.setState({
      user
    });
  }
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    firebase
    .auth()
    .signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
      alert("login sucessfully");
    }).catch((error) => {
      console.log("error===========>",error);
    });

  }

  render() {

    console.log("user=-============>",this.state.user);

    const {email, password} = this.state;
    return (

      <div class="container">
      <div class="panel panel-default">
      <div class="panel-body">
      <form onSubmit={this.handleSubmit}>
      <div class="form-group">
      <label for="email">Email:</label>
      <input type="text" class="form-control" name="email" value={email} onChange={this.handleInputChange} placeholder="Email" />
      </div>
      <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" class="form-control" name="password" value={password} onChange={this.handleInputChange} placeholder="Password" />
      </div><br/>
      <button type="submit" class="btn btn-success">Login</button>
      </form>
      </div>
      </div>
      </div>
      );
    }
  }

  export default Login;