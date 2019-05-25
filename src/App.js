import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

// import Suggestions from './components/Suggestions'
// import { FaPlus} from 'react-icons/fa';
class App extends Component {
  
  logOut(){
    localStorage.getItem('email1')
    console.log(localStorage);
    localStorage.clear()
    console.log(localStorage);
  }
  render() {
    return (
      <div className="container">
      <div className="panel panel-default">
      <div className="panel-body">
      <h4><Link to="/create">Add User</Link></h4>
      <h4><Link to="/login">Login</Link></h4>
      <button className="logout" onClick={this.logOut()}>Logout</button>
      </div>
      </div>
      <h1 className="content" style={{textAlign: 'center'}}>Welcome, Home!</h1>
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