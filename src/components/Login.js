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
      const {email, password} = doc.data();
      user.push({
        key: doc.id,
        doc, 
        email,
        password,
        
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
    const { email, password } = this.state;
    console.log(email);
    console.log(password);
    firebase
    .auth()
    .signInWithEmailAndPassword(email, password).then(()=>{
    
      console.log("login sucessfully")
    }).catch((error) => {
      console.log('hey error: ', error);
    })
  };
  render() {

    const {email, password} = this.state;
    return (

      <div className="container">
      <div className="panel panel-default">
      <div className="panel-body">
      <form onSubmit={this.handleSubmit}>
      <div className="form-group">
      <label for="email">Email:</label>
      <input type="text" className="form-control" name="email" value={email} onChange={this.handleInputChange} placeholder="Email" />
      </div>
      <div className="form-group">
      <label for="password">Password:</label>
      <input type="password" className="form-control" name="password" value={password} onChange={this.handleInputChange} placeholder="Password" />
      </div><br/>
      <button type="submit" className="btn btn-success">Login</button>
      </form>
      </div>
      </div>
      </div>
      );
    }
  }

  export default Login;