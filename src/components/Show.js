import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Show extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      key: ''
    };
  }

  componentDidMount() {
    const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          user: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No User!");
      }
    });
  }

  delete(id){
    firebase.firestore().collection('users').doc(id).delete().then(() => {
      console.log("User successfully deleted!");
      this.props.history.push("/")
    }).catch((error) => {
      console.error("Error removing user: ", error);
    });
  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
          <h4><Link to="/">Users List</Link></h4>
            <h3 class="panel-title">
              {this.state.user.userName}
            </h3>
          </div>
          <div class="panel-body">
            <dl>
             <dt>Name:</dt>
              <dd>{this.state.user.userName}</dd>
              <dt>Email:</dt>
              <dd>{this.state.user.email}</dd>
              <dt>Password:</dt>
              <dd>{this.state.user.password}</dd>
              <dt>Phone:</dt>
              <dd>{this.state.user.phone}</dd>
               <dt>Address:</dt>
              <dd>{this.state.user.address}</dd>
            </dl>
            <Link to={`/edit/${this.state.key}`} class="btn btn-success">Edit</Link>&nbsp;
            <button onClick={this.delete.bind(this, this.state.key)} class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Show;