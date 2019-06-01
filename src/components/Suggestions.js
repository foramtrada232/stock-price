import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import firebase from '../Firebase';
import ReactApexChart from 'react-apexcharts';
import swal from 'sweetalert';
import '../App.css';
import './Company-list.css';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
// import Icon from '@material-ui/core/Icon';


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
			date: "",
			isOpenSearch: false,
			isOpenCompanyList: false,
			open: '',
			close: '',
			high: '',
			low: '',
			clickCompanyName: '',
			clickCompanySymbol: '',
			isSearchClick: false

		};
		this.handleClick1 = this.handleClick1.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getCompany = this.getCompany.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.openSeachbar = this.openSeachbar.bind(this);
		this.displayCompanyList = this.displayCompanyList.bind(this);

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
		document.getElementById("search_form").reset();
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
				swal("Already added!","", "info")
				.then((willDelete) => {
					if(willDelete){
						window.location.reload();

					}
				})
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

	displayCompanyList(){
		const {date} = this.state;
		if (this.state.grapharray.length) {
			console.log('hey i m called');
			var dataSeries = this.state.grapharray;
			console.log("length:",dataSeries.length);
			var ts2 = 1484418600000;
			var dates = [];
			for (var i = 0; i < dataSeries.length; i++) {
				ts2 = ts2 + 86400000;
				var obj = JSON.parse(dataSeries[i].volume)
				// var ts2 = JSON.parse(dataSeries[i].high)
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
				colors: ['red'],
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
			var chartrender = <div id="chart">
			<ReactApexChart options={options} series={series} type="area" height="400" />
			<span style={{color:'gray'}}>Open: </span> <span style = {{marginRight:10}}>{this.state.open}</span>
			<span style={{color:'gray'}}>Close: </span> <span style = {{marginRight:10}}>{this.state.close}</span>
			<span style={{color:'gray'}}>High: </span> <span style = {{marginRight:10}}>{this.state.high}</span>
			<span style={{color:'gray'}}>Low: </span> <span style = {{marginRight:10}}>{this.state.low}</span>
			</div>
		}
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
			</List>
			)}
		</div> : (this.state.searchResponse ? <div>
			<span className="company_symbol">{this.state.clickCompanySymbol}</span><span style={{color: 'gray'}}>{this.state.clickCompanyName}</span>
			{chartrender ? chartrender : ''}
			</div> : '')
		if(this.state.isOpenSearch && !this.state.isSearchClick){
			return(
				<div>
				<div className="grid_class">
				<span style={{fontSize :25}}><b>Stock</b></span><br/>
				<span style={{fontSize:17,color:'gray'}}>{date}</span>
				<div className="logout">
				<Link to ="/"><Button variant="contained"  onClick={()=>this.logOut()}>
				<b>Logout</b>
				</Button></Link>
				</div>
				</div>

				{this.addComapny()}
				<div className="grid_class1">
				<div className="company_list">
				
				<Grid container spacing={12}>
				<Grid item sm={8}>
				<p style={{marginLeft: 18}}>Manage WatchList</p>
				</Grid>
				<Grid item sm={2}>
				<p onClick={()=>this.openCompanyList()} style={{color:'#3f51b5'}}>Done</p>
				</Grid>
				</Grid>
				{this.state.companyData.map(company =>
					<List key={company.key} className="cursorClass">
					<ListItem onClick={() =>this.handleClick(company)}>
					<ListItemText primary={company.symbol} secondary={company.name}/>
					<ListItemSecondaryAction>
					<IconButton edge="end" aria-label="Delete" style={{color:'#ff4d4d'}} onClick={this.deleteCompany.bind(this, company.key)}>
					<RemoveCircle/>
					</IconButton>
					</ListItemSecondaryAction>
					</ListItem>
					</List>
					)}
				</div>
				<div className="searching_list">
				<center><div className="searchCompany_list"><form onSubmit={this.handleSubmit} id="search_form">
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
				</form></div></center>
				</div>					
				</div>
				</div>
				)
		} else if(this.state.isSearchClick ){
			return(
				<div>
				<div className="grid_class">
				<span style={{fontSize :25}}><b>Stock</b></span><br/>
				<span style={{fontSize:17,color:'gray'}}>{date}</span>
				<div className="logout">
				<Link to ="/"><Button variant="contained"  onClick={()=>this.logOut()}>
				<b>Logout</b>
				</Button></Link>
				</div>
				</div>
				
				{this.addComapny()}
				<div className="grid_class1">
				<div className="company_list">
				
				<Grid container spacing={12}>
				<Grid item sm={8}>
				<p style={{marginLeft: 18}}>Manage Watchlist</p>
				</Grid>
				<Grid item sm={2}>
				<p onClick={()=>this.openCompanyList()} style={{color:'#3f51b5'}}>Done</p>
				</Grid>
				</Grid>
				{this.state.companyData.map(company =>
					<List key={company.key} className="cursorClass">
					<ListItem onClick={() =>this.handleClick(company)}>
					<ListItemText primary={company.symbol} secondary={company.name}/>
					<ListItemSecondaryAction>
					<IconButton edge="end" aria-label="Delete" style={{color:'#ff4d4d'}} onClick={this.deleteCompany.bind(this, company.key)}>
					<RemoveCircle/>
					</IconButton>
					</ListItemSecondaryAction>
					</ListItem>
					</List>
					)}
				</div>	
				<div className="searching_list">
				<center><div className="searchCompany_list"><form onSubmit={this.handleSubmit} id="search_form">
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
				</form></div></center>
				<center><div className="searchCompany_list">
				<p>Showing Results for: {this.state.value}</p>
				{this.state.searchResponse.map(data =>	
					<List key={data['1. symbol']} >
					<ListItem>
					<ListItemText  primary={data['1. symbol']} secondary={data['2. name']} />
					<ListItemSecondaryAction >
					<IconButton color="primary" edge="end" aria-label="Delete" onClick={() =>this.handleClick1(data)} >
					<AddIcon/>
					</IconButton>
					</ListItemSecondaryAction>
					</ListItem>
					</List>
					)}
				</div>	</center>
				</div>			
				</div>
				</div>
				)
			
		}else{
			if(!this.state.isOpenCompanyList){
				return (
					<div>
					<div className="grid_class">
					<span style={{fontSize :28}}><b>Stock</b></span><br/>
					<span style={{fontSize:17,color:'gray'}}>{date}</span>
					<div className="logout">
					<Link to ="/"><Button variant="contained"  onClick={()=>this.logOut()}>
					<b>Logout</b>
					</Button></Link>
					</div>
					</div>
					<div className="grid_class1">
					<div className="company_list">
					<div className="plus_class">
					<Grid container spacing={12}>
					<Grid item sm={4}>
					<IconButton color="primary" edge="end" aria-label="Delete" className="addIcon" onClick={()=>this.openSeachbar()}>
					<AddIcon />
					</IconButton>
					</Grid>
					<Grid item sm={8}>
					<p>Manage WatchList</p>
					</Grid>
					</Grid>
					</div>
					{this.state.companyData.map(company =>
						<List key={company.key} className="cursorClass">
						<ListItem onClick={() =>this.handleClick(company)}>
						<ListItemText primary={company.symbol} secondary={company.name}/>
						<ListItemSecondaryAction>
						<IconButton edge="end" aria-label="Delete" style={{color:'#ff4d4d'}} onClick={this.deleteCompany.bind(this, company.key)}>
						<RemoveCircle/>
						</IconButton>
						</ListItemSecondaryAction>
						</ListItem>
						</List>
						)}
					</div>
					<div className="graph_list">
					{showGraphOrSearchResult}
					</div>
					</div>
					</div>
					)
			}

		}
	}	

	getApiData() {
		console.log("value:",this.state.value);
		axios.get("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+this.state.value+"&apikey=Z51NHQ9W28LJMOHB")
		.then((data)=>{
			console.log("data of response:",data);
			this.setState({
				searchResponse: data.data['bestMatches'],
				isSearchClick: true
			});
		})
	}

	componentDidMount() {
		this.getCompany();
		this.getDate();
		this.unsubscribe = this.ref.onSnapshot(this.getCompany);
	}

	getDate = () => {
		var date = new Date().toDateString();
		this.setState({ date });
	};

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
			setLoader(true);
			if (companyData.length) {
				console.log('found data', companyData);
				setTheState(companyData);
			}else{
				console.log("->>>>>>>>>>>>>..no data bhavik");
			}
		}).catch(function(error) {
			console.log("Error getting documents: ", error);
		});
		var setLoader = (isLoaded) =>{
			this.setState({
				isLoaded: isLoaded
			})
		}

		var setTheState = (companyData) =>{
			this.setState({
				companyData: companyData,
				isLoaded: true
			})
		}
	}	

	displayGraph(){
		let companySymbol = this.state.companyData[0];
		console.log("symbol============>",companySymbol);
		// handleClick(companySymbol)
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
		const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+data.symbol+"&name=apple&interval=5min&apikey= Z51NHQ9W28LJMOHB";
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
			console.log("open:",grapharray['0'].open);
			this.setState({
				grapharray: grapharray,
				open: grapharray['0'].open,
				close: grapharray['0'].close,
				high: grapharray['0'].high,
				low: grapharray['0'].low,
				clickCompanyName: data.name,
				clickCompanySymbol: data.symbol
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

	openSeachbar(){
		this.setState({
			isOpenSearch: true
		});
	}

	openCompanyList(){
		console.log("----------done---------");
		this.setState({isOpenCompanyList: false})
		console.log("isOpenCompanyList:",this.state.isOpenCompanyList);
		window.location.href='/company';
	}

	render() {
		const { isLoaded} = this.state;
		
		if (!isLoaded) {
			return (
				<center>
				<div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
				</center>
				)
		} else if(isLoaded){
			return(
				<div>
				{this.displayGraph()}
				{this.displayCompanyList()}
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

