import React, { Component } from 'react';
import firebase from '../Firebase';
import ReactApexChart from 'react-apexcharts'
import axios from 'axios';
import './Company-list.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';

class Companylist extends Component {
	constructor(props) {
		super(props);
		this.ref = firebase.firestore().collection('company');
		this.unsubscribe = null;
		this.state = {
			companyData: [],
			array: [],
			grapharray: [],
		};
		this.getCompany = this.getCompany.bind(this);
		this.handleClick = this.handleClick.bind(this);
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
			})
		}
	}	

	deleteCompany(id){
		firebase.firestore().collection('company').doc(id).delete().then(() => {
			alert('Company successfully deleted!')
			console.log("Document successfully deleted!");
			this.props.history.push("/company-list")
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

	// logOut(){
	// 	localStorage.getItem('email1')
	// 	console.log(localStorage);
	// 	localStorage.clear()
	// 	console.log(localStorage);
	// }

	render() {
		if (this.state.grapharray.length) {
			console.log('hey i m called');
			var dataSeries = this.state.grapharray;
			console.log("length:",dataSeries.length);
			var ts2 = 1484418600000;
			var dates = [];
			for (var i = 0; i < dataSeries.length; i++) {
				ts2 = ts2 + 86400000;
				// console.log('der ', dataSeries[i].volume)
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
				colors: ['#ff3333'],
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
			<ReactApexChart options={options} series={series} type="area" height="350" />
			</div>
		}
		return (
			<div className="grid_class1">
			<div className="company_list">
			<h3>Company List</h3>
			{this.state.companyData.map(company =>
				<List  key={company.key}>
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
			<h4>Graph</h4>
			{chartrender ? chartrender : ''}
			</div>
			</div>
				)
	}
}



export default Companylist
