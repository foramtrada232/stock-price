import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Create extends Component {

  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = {
      userName: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const {email, password } = this.state;

    this.ref.add({
     
      email,
      password,
   
    }).then((docRef) => {
      this.setState({
        email: '',
        password: '',
       
      });
      console.log("push");
      this.props.history.push("/")
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
     firebase
     .auth()
     .createUserWithEmailAndPassword(email, password).then((u)=>{
      
      alert("signup sucessfully");
    }).catch((error) => {
        console.log("error===========>",error);
      });
  }

  render() {
    const { email, password } = this.state;
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              ADD USER
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to="/" class="btn btn-primary">Users List</Link></h4>
            <form onSubmit={this.onSubmit}>
              
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" class="form-control" name="email" value={email} onChange={this.onChange} placeholder="Email" />
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" class="form-control" name="password" value={password} onChange={this.onChange} placeholder="Password" />
              </div>
              
              
              <button type="submit" class="btn btn-success">Sign up</button>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;


// <div class="form-group">
//                 <label for="userName">UserName:</label>
//                 <input type="text" class="form-control" name="userName" value={userName} onChange={this.onChange} placeholder="UserName" />
//               </div>
//               <div class="form-group">
//                 <label for="phone">Phone:</label>
//                 <input type="number" class="form-control" name="phone" value={phone} onChange={this.onChange} placeholder="Phone" />
//               </div>
//               <div class="form-group">
//                 <label for="address">Address:</label>
//                 <textArea class="form-control" name="address" onChange={this.onChange} placeholder="Address" cols="80" rows="3">{address}</textArea>
//               </div>