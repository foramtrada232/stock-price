import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import firebase from './Firebase';
// import login from './components/Login';
class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.unsubscribe = null;
    // this.array = [];
    this.state = {
      user: [],
      array:[]
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

    fetch("http://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=3842640E411845D4B6F018B49D78E837&symbol=AAPL")
    .then(res => res.json())
    .then(res => {console.log(res); return res;})
    .then(res =>{
      this.setState(prevState =>({
        array: [...prevState.array,res]
      }))  
      console.log("data====>",this.state.array);
    })
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);

  }

  render() {
    console.log("render--------",this.state.array);
    console.log("user=-============>",this.state.user);
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              USERS LIST
            </h3>

          </div>
          <div class="panel-body">
            <h4><Link to="/create">Add User</Link></h4>
            <table class="table table-stripe">
              <thead>
                <tr>
                  <th>UserName</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {this.state.user.map(data =>
                  <tr>
                    <td><Link to={`/show/${data.key}`}>{data.userName}</Link></td>
                    <td>{data.email}</td>
                    <td>{data.phone}</td>
                    <td>{data.address}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
     
       

        </div>
    )
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
 //        <table class="table table-stripe table2" >
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



 // 3842640E411845D4B6F018B49D78E837
 // http://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=3842640E411845D4B6F018B49D78E837&symbol=AAPL