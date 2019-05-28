import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from './Firebase';
import './components/login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

class App extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
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
      <Grid container spacing={1} xs={12}>
      <Grid item ={true} sm={12} xs={12}>
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
      <Grid item ={true} sm={12} xs={12}>
      <TextField
      id="outlined-password-input"
      label="Password"
      type="password"
      name="password"
      autoComplete="current-password"
      margin="normal"
      variant="outlined"
      value={password} 
      onChange={this.handleInputChange}
      />
      </Grid>
      <Grid item ={true} sm={12} xs={12}>
      <Button color="primary"  variant="contained" size="large" onClick={(event)=>this.handleSubmit(event)}>
      Login
      </Button>
      </Grid>
      <Grid item ={true} sm={12}>
      <Divider />
      <div className="text-center">
      New User? <Button color="primary"><Link to="/create">Sign Up</Link></Button>
      </div>
      </Grid>
      </Grid>
      </div>
      </div>
      </div>
      );
  }
}

export default App;

// PK47YCLB9PYYA7FFFVK7
// https://paper-api.alpaca.markets
// final:Z51NHQ9W28LJMOHB
// https://api-v2.intrinio.com/companies/AAPL?api_key=OmNiNjMyNzI5YWNhMmYwNTRmYmRlNGVlZTdhYjQ1ZGM1
// https://financialmodelingprep.com/api/v2/financials/income-statement/AAPL
// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey= Z51NHQ9W28LJMOHB

// <h4>Company </h4>
//        <table className="table table-stripe table2" >
//        <thead>
//        <tr>
//        <th>Information</th>
//        <th>Symbol</th>
//        <th>Last refreshed</th>
//        <th>Time Zone</th>
//        <th>Monthly time series</th>
//        </tr>
//        </thead>
//        <tbody>
//        {this.state.array.map(data=>
  //          <tr>
  //          <td>{data['Meta Data']['1. Information']}</td>
  //          <td> {data['Meta Data']['2. Symbol']}</td>
  //          <td> {data['Meta Data']['3. Last Refreshed']}</td>
  //          <td> {data['Meta Data']['4. Time Zone']}</td>
  //          <td>
  //              {data['Monthly Time Series']['2000-01-31']['1. open']}
  //            </td>
  //          </tr>


  //        )}
  //        </tbody>
  //        </table>
  // <table className="table table-stripe">
  //       <thead>
  //       <tr>
  //       <th>Email</th>
  //       </tr>
  //       </thead>
  //       <tbody>
  //       {this.state.user.map(data =>
    //         <tr>
    //         <td>{data.email}</td>
    //         </tr>
    //         )}
    //       </tbody>
    //       </table>


    // 3842640E411845D4B6F018B49D78E837
      // http://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=3842640E411845D4B6F018B49D78E837&symbol=AAPL