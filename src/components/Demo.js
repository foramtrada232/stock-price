import React, { Component } from 'react';
import firebase from '../Firebase';
import './login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

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
      localStorage.setItem('email1',email)
      console.log(localStorage);
  
     this.props.history.push("/company");
      console.log("login sucessfully")
    }).catch((error) => {
      console.log('hey error: ', error);
    })
  };
  render() {
    const {email, password} = this.state;
    return (

      <div>
      <div className="backgroung_class">
      <div className="main_class">
      <h1 className="text-center">Stock Login</h1>
      <Grid container spacing={12} xs={12}>
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
      onChange={this.handleInputChange}
      />
      </Grid>
      <Grid item sm={12} xs={12}>
      <TextField
      id="outlined-password-input"
      label="Password"
      type="password"
      autoComplete="current-password"
      margin="normal"
      variant="outlined"
      value={password} 
      onChange={this.handleInputChange}
      />
      </Grid>
      <Grid item sm={12} xs={12}>
      <Button color="primary"  variant="contained" size="large" onClick={(event)=>this.handleSubmit(event)}>
        Login
      </Button>
      </Grid>
      <Divider />
      <Grid item sm={12}>
      <div className="text-center">
      New User? <Button color="primary"><Link to="/create">Sign Up</Link></Button>
      </div>
      </Grid>
      </Grid>
      
      </div>
      </div>

      <div className="panel panel-default">
      <div className="panel-body">
      <form onSubmit={this.handleSubmit}>
      <div className="form-group">
      <label htmlFor="email">Email:</label>
      <input type="text" className="form-control" name="email" value={email} onChange={this.handleInputChange} placeholder="Email" />
      </div>
      <div className="form-group">
      <label htmlFor="password">Password:</label>
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

