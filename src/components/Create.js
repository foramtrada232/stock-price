import React, { Component } from 'react';
import firebase from '../Firebase';
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

    const {email, password, username, createdAt } = this.state;

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
      console.log("push");
      this.props.history.push("/")
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password).then((u)=>{
      return this.props.firebase.user(u.user.uid).set({
        username,
        email,
        createdAt,
      });

    }).catch((error) => {
      console.log("error===========>",error);
    });
  }

  render() {
    const { email, password, username, createdAt } = this.state;
    return (
      <div className="container">
      <div className="panel panel-default">
      <div className="panel-heading">
      <h3 className="panel-title">
      ADD USER
      </h3>
      </div>
      <div className="panel-body">
      <h4><Link to="/" className="btn btn-primary">Users List</Link></h4>
      <form onSubmit={this.onSubmit}>
      <div className="form-group">
      <label htmlFor="email">Email:</label>
      <input type="email" className="form-control" name="email" value={email} onChange={this.onChange} placeholder="Email" />
      </div>
      <div className="form-group">
      <label htmlFor="password">Password:</label>
      <input type="password" className="form-control" name="password" value={password} onChange={this.onChange} placeholder="Password" />
      </div>
      <div className="form-group">
      <label htmlFor="username">UserName:</label>
      <input type="text" className="form-control" name="username" value={username} onChange={this.onChange} placeholder="UserName" />
      </div>
      <div className="form-group">
      <label htmlFor="createdAt">created:</label>
      <input type="date" className="form-control" name="createdAt" value={createdAt} onChange={this.onChange} placeholder="Phone" />
      </div>

      <button type="submit" className="btn btn-success">Sign up</button>

      </form>
      </div>
      </div>
      </div>
      );
  }
}

export default Create;


// <div className="form-group">
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