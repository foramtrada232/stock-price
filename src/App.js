import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import firebase from './Firebase';
import axios from 'axios';
// import Suggestions from './components/Suggestions'
// import { FaPlus} from 'react-icons/fa';
class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.unsubscribe = null;
    this.state = {
      isToggleOn: true,
      user: [],
      array:[],
      searchResponse: [],
      results: [],
      query: '',
      value: '',
      companySymbol: '',

    };
    this.handleClick1 = this.handleClick1.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }

        onCollectionUpdate = (querySnapshot) => {
          const user = [];
          querySnapshot.forEach((doc) => {
            const {email, password,username,createdAt} = doc.data();
            user.push({
              key: doc.id,
              doc, 
              username,
              email,
              password,
              createdAt
            });
          });
          this.setState({
            user
          });
        }

        componentDidMount() {
          this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
        }

        handleChange(event) {
          this.setState({value: event.target.value});
        }

        handleSubmit(event) {
          console.log("name:",this.state.value);
          event.preventDefault();
          this.getApiData();
        }

        handleInputChange = () => {
          this.setState({
            query: this.search.value
          }, () => {
            console.log("query:",this.state.query);
            if (this.state.query && this.state.query.length > 1) {
              if (this.state.query.length % 2 === 0) {
                this.getInfo()
              }
            } else if (!this.state.query) {
            }
          })
        }

        // handleClick() {
          //   this.setState(state => ({
            //     isToggleOn: !state.isToggleOn
            //   }));
            //   console.log("hello");
            // }

            handleClick1(event) {
              console.log('data: ', event);
              this.setState({companySymbol: event});
              this.getApiData();
              this.addComapny();
            }

            getInfo = () => {
              axios.get("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+this.state.value+"&apikey=Z51NHQ9W28LJMOHB")
              .then(({ data }) => {
                this.setState({
                  results: data.data
                })
              })
            }

            addComapny(){
              console.log("addCompany:",this.state.companySymbol)
              if (this.state.companySymbol) {
                return(
                  <div className="hello">
                  <p>{this.state.companySymbol}</p>
                  <button onClick={this.updateCompany()}>Add Company</button>
                  </div>
                  )
              }
            }

            updateCompany(){
              const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
              ref.get().then((doc) => {
                if (doc.exists) {
                  const users = doc.data();
                  this.setState({
                    key: doc.id,
                    company : this.state.companySymbol
                  });
                } else {
                  console.log("No such document!");
                }
              });
            }

            displayData(){
              if(this.state.searchResponse === undefined ){
                console.log("No data found");
                console.log(this.state.searchResponse);
              }else{
                console.log("--else call--",this.state.searchResponse);
                return(
                  <div className="container">
                  <table className="table table-stripe">
                  <thead>
                  <tr>
                  <th>Company</th>
                  <th>Symbol</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.searchResponse.map(data =>
                    <tr>
                    <td><button onClick={this.handleClick}>{data['2. name']}</button></td>
                    <td><button onClick={() =>this.handleClick1(data['1. symbol'])} >{data['1. symbol']}</button></td>
                    </tr>
                    )}
                  </tbody>
                  </table>

                  </div>
                  )

              }
            }

            getApiData() {
              axios.get("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+this.state.value+"&apikey=Z51NHQ9W28LJMOHB")
              .then((data)=>{

                // let a= this.state.searchResponse.push(data)

                this.setState({
                  searchResponse: data.data['bestMatches']});
                // this.setState({[searchResponse]: data});
                // console.log("127:",typeof searchResponse);
                // this.setState({ searchResponse: [data] });
                // const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+this.state.companySymbol+"&name=apple&interval=5min&apikey= Z51NHQ9W28LJMOHB";
                // fetch(url)
                // .then(res => res.json())
                // .then(res => {console.log(res); return res;})
                // .then(res => {
                //       this.setState(prevState =>({
                //             array: [...prevState.array, res]
                //           }))  
                //           console.log("data====>",this.state.array);
                //         }).catch(error => console.log('hello error: ', error));
                //         axios.get(url, (error, response) => {
                //               console.log('error: ', error);
                //               console.log('response: ', response);
                            // });
                          })
                    // })
            }
            render() {
              console.log("user=-============>",this.state.user);
              return (

                <div className="container">
                <div className="panel panel-default">
                <div className="panel-heading">
                <h3 className="panel-title">
                USERS LIST
                </h3>
                </div>
                <div className="panel-body">
                <h4><Link to="/create">Add User</Link></h4>

                </div>
                </div>
                <h1 className="content" style={{textAlign: 'center'}}>Welcome, Home!</h1>

                <form onSubmit={this.handleSubmit}>
                <label>Company: </label>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                <input type="submit" value="Submit"/>
                </form>
                {this.displayData()}
                {this.addComapny()}
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