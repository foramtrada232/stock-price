import React, { Component } from 'react';
import firebase from '../Firebase';
import './login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';


class Create extends Component {

  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = {
      email: '',
      password: '',
      username: '',
      createdAt: '',
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const {email, password, username } = this.state;
    this.ref.add({
      email,
      password,
      username,
      createdAt: Date.now(),
      isDeleted:false,
      updatedAt:Date.now(),
      company:[]
    }).then((docRef) => {
      this.setState({
        email: '',
        password: '',
      });
      this.props.history.push("/login")
      console.log("signup sucessfully");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password).then((u)=>{
      // return this.props.firebase.users(u.users.uid).set({
      //     username,
      //     email
      //   });
        this.props.history.push("/login");
      }).catch((error) => {
        console.log("error===========>",error);
      });
    };

  render() {
    const { email, password, username } = this.state;
    return (
      <div>
      <div className="backgroung_class">
      <div className="main_class ">
      <h1 className="text-center">Stock Signup</h1>
      <Grid container spacing={1} xs={12}>
      <Grid item sm={12} xs={12}>
      <TextField
      id="outlined-user-input"
      label="Username"
      type="text"
      name="username"
      margin="normal"
      variant="outlined"
      value={username} 
      onChange={this.onChange}
      />
      </Grid>
      <Grid item sm={12} xs={12}>
      <TextField
      id="outlined-email-input"
      label="Email"
      type="email"
      name="email"
      autoComplete="email"
      margin="normal"
      variant="outlined"
      value={email} 
      onChange={this.onChange}
      /> 
      </Grid>
     <Grid item sm={12} xs={12}>
      <TextField
      id="outlined-password-input"
      label="Password"
      type="password"
      name="password"
      autoComplete="current-password"
      margin="normal"
      variant="outlined"
      value={password}
      onChange={this.onChange}
      />
      </Grid>
      <Grid item sm={12} xs={12}>
      <Button color="primary"  variant="contained" size="large" onClick={(e)=>this.onSubmit(e)}>
        SignUp
      </Button>
      </Grid>
      <Divider />
      <Grid item sm={12}>
      <div className="text-center">
      Already Registered? <Button color="primary"><Link to="/login">Login</Link></Button>
      </div>
      </Grid>
      </Grid>
      
      </div>
      </div>
      </div>
      );
  }
}
  export default Create;
