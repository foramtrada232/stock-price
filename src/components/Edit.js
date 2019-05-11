import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    };
  }

  componentDidMount() {
    const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        const user = doc.data();
        this.setState({
          key: doc.id,
          userName: user.userName,
          email: user.email,
          password: user.password,
          phone: user.phone,
          address: user.address
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState({user:state});
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { userName, email, password, phone, address } = this.state;

    const updateRef = firebase.firestore().collection('users').doc(this.state.key);
    updateRef.set({
      userName,
      email,
      password,
      phone,
      address
    }).then((docRef) => {
      this.setState({
        key: '',
        userName: '',
        email: '',
        password: '',
        phone: '',
        address: ''
      });
      this.props.history.push("/show/"+this.props.match.params.id)
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              EDIT USER
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to={`/show/${this.state.key}`} class="btn btn-primary">User List</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="userName">UserName:</label>
                <input type="text" class="form-control" name="userName" value={this.state.userName} onChange={this.onChange} placeholder="UserName" />
              </div>
               <div class="form-group">
                <label for="title">Email:</label>
                <input type="text" class="form-control" name="email" value={this.state.email} onChange={this.onChange} placeholder="Email" />
              </div>
               <div class="form-group">
                <label for="title">Password:</label>
                <input type="text" class="form-control" name="password" value={this.state.password} onChange={this.onChange} placeholder="Password" />
              </div>
              <div class="form-group">
                <label for="phone">Phone:</label>
                <input type="text" class="form-control" name="phone" value={this.state.phone} onChange={this.onChange} placeholder="Phone" />
              </div>
               <div class="form-group">
                <label for="address">Address:</label>
                <input type="text" class="form-control" name="address" value={this.state.address} onChange={this.onChange} placeholder="Address" />
              </div>
              <button type="submit" class="btn btn-success">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;