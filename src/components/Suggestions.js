import React, { Component } from 'react';
import axios from 'axios';
import firebase from '../Firebase';
import ReactApexChart from 'react-apexcharts';
import swal from 'sweetalert';
import '../App.css';
import './Company-list.css';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';


class Suggestions extends Component {

	constructor(props) {
		super(props);
		this.ref = firebase.firestore().collection('company');
		this.unsubscribe = null;
		this.state = {
			isToggleOn: true,
			user: [],
			array:[],
			searchResponse: [],
			results: [],
			companyData: [],
			query: '',
			value: '',
			companySymbol: '',
			companyName: '',
			symbol: '',
			name: '',
			userEmail: '',
			grapharray: [],
			isLoaded: false,
		};
		this.handleClick1 = this.handleClick1.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getCompany = this.getCompany.bind(this);
		this.handleClick = this.handleClick.bind(this);
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

	handleClick1(data) {
		console.log('data: ', data);
		this.setState({companySymbol: data['1. symbol'],companyName: data['2. name']});
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
		if (this.state.companySymbol) {
			console.log("addCompany2:",this.state.companySymbol);
			return(
				swal({
					title: this.state.companySymbol,
					text: this.state.companyName,
					icon: "success",
					buttons: true,
					dangerMode: true,
				}).then((willDelete) => {
					if(willDelete){
						this.updateCompany(this.state.companyName)
					} else{
						console.log("no data found");
					}
				})
				)
		}
	}

	updateCompany(companyName){
		console.log('updatecompany:');
		localStorage.getItem('email1')
		let email = localStorage.email1;
		console.log(companyName)
		let companyData = [];
		firebase.firestore().collection("company").where("name", "==", companyName).where("email", "==", email) 
		.get()
		.then(function(querySnapshot) {
			console.log("querySnapshot",querySnapshot)
			querySnapshot.forEach(function(doc) {
				const { name, email } = doc.data();
				console.log("data:",doc.data())
				companyData.push({
					key: doc.id,
					doc,
					name,
					email,
				});
			});
			console.log("data1:",companyData.length);
			if (companyData.length) {
				console.log('found data', companyData);
				swal("Already added!","", "info");
			} else{
				console.log("new company");
				addCompany1()
			}
		});

		let addCompany1 = () =>{
			localStorage.getItem('email1')
			let email = localStorage.email1;
			this.ref.add({
				symbol:this.state.companySymbol,
				name:this.state.companyName,
				email: email
			}).then((docRef) => {
				this.setState({
					name: this.state.companyName,
					symbol: this.state.companySymbol,
					email: email,
					isLoaded: true
				});
				console.log("name:",this.state.companyName + "symbol:",this.state.companySymbol);
				window.location.reload();
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			})
		}
	}

	getApiData() {
		axios.get("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+this.state.value+"&apikey=Z51NHQ9W28LJMOHB")
		.then((data)=>{
			console.log("data of response:",data);
			this.setState({
				searchResponse: data.data['bestMatches'],
			});
		})
	}

	componentDidMount() {
		this.getCompany();
		this.unsubscribe = this.ref.onSnapshot(this.getCompany);
	}

	getCompany(){
		let companyData = [];
		localStorage.getItem('email1')
		let email = localStorage.email1;
		console.log('email==========>',email);
		firebase.firestore().collection("company").where("email", "==", email)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				const { name, symbol } = doc.data();
				companyData.push({
					key: doc.id,
					doc,
					name,
					symbol,
				});
			});
			if (companyData.length) {
				console.log('found data', companyData);
				setTheState(companyData);
			}
		}).catch(function(error) {
			console.log("Error getting documents: ", error);
		});

		var setTheState = (companyData) =>{
			this.setState({
				companyData: companyData,
				isLoaded: true
			})
		}
	}	

	deleteCompany(id){
		firebase.firestore().collection('company').doc(id).delete().then(() => {
			swal("Successfully deleted!","", "success");
			console.log("Document successfully deleted!");
		}).catch((error) => {
			console.log("Error removing document: ", error);
		});
	}	

	handleClick(data) {
		console.log('data: ', data);
		let grapharray = [];
		console.log("Time Series (5min):",data['Time Series (5min)']);
		const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+data+"&name=apple&interval=5min&apikey= Z51NHQ9W28LJMOHB";
		fetch(url)
		.then(res => res.json())
		.then(res => {console.log(res); return res;})
		.then(res => {
			const originalObject = res['Time Series (5min)'];
			for (let key in originalObject) {
				grapharray.push({
					date: key,
					open: originalObject[key]['1. open'],
					high: originalObject[key]['2. high'],
					low: originalObject[key]['3. low'],
					close: originalObject[key]['4. close'],
					volume: originalObject[key]['5. volume']
				})
			}
			console.log('grapharray: ', grapharray);
			this.setState({
				grapharray: grapharray
			})
		}).catch(error => console.log('hello error: ', error));
		axios.get(url, (error, response) => {
			console.log('error: ', error);
			console.log('response: ', response);
		});
	}	

	logOut(){
		firebase
		.auth()
		.signOut().then(function() {
			console.log('Signed Out');
			localStorage.getItem('email1i');
			console.log(localStorage);
			localStorage.removeItem('email1');
			console.log(localStorage);
		}, function(error) {
			console.error('Sign Out Error', error);
		});
	}

	render() {
		const { isLoaded,array } = this.state;
		if (this.state.grapharray.length) {
			console.log('hey i m called');
			var dataSeries = this.state.grapharray;
			console.log("length:",dataSeries.length);
			var ts2 = 1484418600000;
			var dates = [];
			for (var i = 0; i < dataSeries.length; i++) {
				ts2 = ts2 + 86400000;
				var obj = JSON.parse(dataSeries[i].volume)
				var innerArr = [ts2,obj];
				dates.push(innerArr)
			}
			console.log("dates:",dates);
			let  options ={
				chart: {
					stacked: false,
					zoom: {
						type: 'x',
						enabled: true
					},
					toolbar: {
						autoSelected: 'zoom'
					}
				},
				plotOptions: {
					line: {
						curve: 'smooth',
					}
				},
				dataLabels: {
					enabled: false
				},

				markers: {
					size: 0,
					style: 'full',
				},
				colors: ['#000'],
				title: {
					text: 'Stock Price Movement',
					align: 'left'
				},
				fill: {
					type: 'gradient',
					gradient: {
						shadeIntensity: 1,
						inverseColors: false,
						opacityFrom: 0.5,
						opacityTo: 0,
						stops: [0, 90, 100]
					},
				},
				yaxis: {
					min: 0,
					max: 250000,
					labels: {
						formatter: function (val) {
							return (val).toFixed(0);
						},
					},
					title: {
						text: 'Price'
					},
				},
				xaxis: {
					type: 'datetime',
				},
				tooltip: {
					shared: false,
					y: {
						formatter: function (val) {
							return (val/1000).toFixed(0)
						}
					}
				}
			}
			let series = [{
				name: 'Stock price',
				data: dates
			},
			]
			console.log('series: ', this.state.series);
			console.log('after series: ', series);
			console.log('options: ', this.state.options);
			console.log('after options: ', options);
			var chartrender = <div id="chart">
			<ReactApexChart options={options} series={series} type="area" height="400" />
			</div>
		}
			console.log("searchresponse=========================>",this.state.searchResponse);
			var showGraphOrSearchResult = this.state.searchResponse.length ? <div>
			<center><h3>Search Response....</h3></center>
			{this.state.searchResponse.map(data =>	
				<List key={data['1. symbol']} className="list">
				<ListItem>
				<ListItemText className="search_list" primary={data['1. symbol']} secondary={data['2. name']} />
				<ListItemSecondaryAction className="search_list1">
				<IconButton color="primary" edge="end" aria-label="Delete" onClick={() =>this.handleClick1(data)} className="addIcon">
				<AddIcon/>
				</IconButton>
				</ListItemSecondaryAction>
				</ListItem>
				<Divider />
				</List>
				)}
			</div> : (this.state.searchResponse ? <div>
				<center><h3>Graph</h3></center>
				{chartrender ? chartrender : ''}
				</div> : '')
			if (!isLoaded) {
				return (
					<center><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></center>
					)
			} else if(isLoaded){
				return (
					<div>
					<div className="grid_class">
					<div className="header_class">
					<span>Welcome Home....</span>
					</div>
					<div className="logout">
					<a href="/"><Button variant="contained"  onClick={()=>this.logOut()}>
					<b>Logout</b>
					</Button></a>
					</div>
					<div className="search">
					<form onSubmit={this.handleSubmit}>
					<Input className="search_input"
					placeholder="Search Company"
					inputProps={{
						'aria-label': 'Description',
					}}
					value={this.state.value}
					onChange={this.handleChange}
					/>
					<Button varient="filed" className="search_button" type="submit">
					search
					</Button>
					</form>
					</div>
					{this.addComapny()}
					</div>
					<div className="grid_class1">
					<div className="company_list">
					<h3>Company List</h3>
					{this.state.companyData.map(company =>
						<List key={company.key}>
						<ListItem onClick={() =>this.handleClick(company.symbol)}>
						<ListItemText primary={company.symbol} secondary={company.name}/>
						<ListItemSecondaryAction>
						<IconButton edge="end" aria-label="Delete" onClick={this.deleteCompany.bind(this, company.key)}>
						<DeleteIcon />
						</IconButton>
						</ListItemSecondaryAction>
						</ListItem>
						<Divider />
						</List>
						)}
					</div>
					<div className="graph_list">
					{showGraphOrSearchResult}
					</div>
					</div>
					</div>
					)
			} else{
				return(
					<div>
					<h2>Sorry no data found</h2>
					</div>
					);
			}


		}
}


export default Suggestions

