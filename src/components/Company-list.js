import React, { Component } from 'react';
import firebase from '../Firebase';
import ReactApexChart from 'react-apexcharts'
import axios from 'axios';
import { Link } from 'react-router-dom';


var dataSeries = [
{
	"date": "2014-01-01",
	"value": 20000000
},
{
	"date": "2014-03-19",
	"value": 48027074
},
{
	"date": "2014-03-20",
	"value": 48927079
},
{
	"date": "2014-03-21",
	"value": 48727071
},
{
	"date": "2014-03-22",
	"value": 48127072
},
{
	"date": "2014-03-23",
	"value": 48527072
},
{
	"date": "2014-03-24",
	"value": 48627027
},
{
	"date": "2014-03-25",
	"value": 48027040
},
{
	"date": "2014-03-26",
	"value": 48027043
},
{
	"date": "2014-03-27",
	"value": 48057022
},
{
	"date": "2014-03-28",
	"value": 49057022
},
{
	"date": "2014-03-29",
	"value": 50057022
},
{
	"date": "2014-03-30",
	"value": 51057022
},
{
	"date": "2014-03-31",
	"value": 52057022
},
{
	"date": "2014-04-01",
	"value": 53057022
},
{
	"date": "2014-04-02",
	"value": 54057022
},
{
	"date": "2014-04-03",
	"value": 52057022
},
{
	"date": "2014-04-04",
	"value": 55057022
},
{
	"date": "2014-04-05",
	"value": 58270783
},
{
	"date": "2014-04-06",
	"value": 56270783
},
{
	"date": "2014-04-07",
	"value": 55270783
},
{
	"date": "2014-04-08",
	"value": 58270783
},
{
	"date": "2014-04-09",
	"value": 59270783
},
{
	"date": "2014-04-10",
	"value": 60270783
},
{
	"date": "2014-04-11",
	"value": 61270783
},
{
	"date": "2014-04-12",
	"value": 62270783
},
{
	"date": "2014-04-13",
	"value": 63270783
},
{
	"date": "2014-04-14",
	"value": 64270783
},
{
	"date": "2014-04-15",
	"value": 65270783
},
{
	"date": "2014-04-16",
	"value": 66270783
},
{
	"date": "2014-04-17",
	"value": 67270783
},
{
	"date": "2014-04-18",
	"value": 68270783
},
]





var ts2 = 1484418600000;
var dates = [];
for (var i = 0; i < dataSeries.length; i++) {
	ts2 = ts2 + 86400000;
	var innerArr = [ts2, dataSeries[i].value];
	dates.push(innerArr)
}
class Companylist extends Component {
	constructor(props) {
		super(props);
		this.ref = firebase.firestore().collection('company');
		this.unsubscribe = null;
		this.state = {
			companyData: [],
			array: [],
			grapharray: [],
			options: {
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
					min: 20000000,
					max: 250000000,
					labels: {
						formatter: function (val) {
							return (val / 1000000).toFixed(0);
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
							return (val / 1000000).toFixed(0)
						}
					}
				}
			},
			series: [{
				name: 'XYZ MOTORS',
				data: dates
			}],

			
		};
		this.getCompany = this.getCompany.bind(this);
		this.handleClick = this.handleClick.bind(this);
		// this.generateDataPoints = this.generateDataPoints.bind(this);
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
				setTheSeate(companyData);
			}
		}).catch(function(error) {
			console.log("Error getting documents: ", error);
		});

		var setTheSeate = (companyData) =>{
			this.setState({
				companyData: companyData,
			})
		}
	}	

	delete(id){
		console.log("id:",id);
		firebase.firestore().collection('company').doc(id).delete().then(() => {
			console.log("Document successfully deleted!");
			this.props.history.push("/company-list")
		}).catch((error) => {
			console.error("Error removing document: ", error);
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
			// this.setState(prevState =>({
				// 	array: [...prevState.array, res]
				// }))  
				// console.log("data====>",this.state.array['0']['Time Series (5min)']['2019-05-23 14:10:00']);
			}).catch(error => console.log('hello error: ', error));
		axios.get(url, (error, response) => {
			console.log('error: ', error);
			console.log('response: ', response);
		});
		
	}	

	render() {
		if (this.state.grapharray.length) {
			console.log('hey i m called');
			var dataSeries = this.state.grapharray;
			var ts2 = 1484418600000;
			var dates = [];
			for (var i = 0; i < dataSeries.length; i++) {
				ts2 = ts2 + 86400000;
				console.log('der ', dataSeries[i].open)
				var innerArr = [ts2, dataSeries[i].open];
				dates.push(innerArr)
			}
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
					min: 20000000,
					max: 250000000,
					labels: {
						formatter: function (val) {

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

						}
					}
				}
			}
			let series = [{
				name: 'XYZ MOTORS',
				data: dates
			}]

			console.log('series: ', this.state.series);
			console.log('options: ', this.state.options);

			console.log('series: ', series);
			console.log('options: ', options);
			var chartrender = <div id="chart">
			<ReactApexChart options={this.state.options} series={this.state.series} type="area" height="350" />
			</div>
		}

		return (
			<div className="container">
			(this.state.grapharray.length) 
			{chartrender ? chartrender : ''}
			<div className="panel panel-default">
			<div className="panel-heading">
			<h3 className="panel-title">
			Company LIST
			</h3>
			</div>
			<div className="panel-body">
			<table className="table table-stripe">
			<thead>
			<tr>
			<th>Name</th>
			<th>Symbol</th>
			<th>Action</th>
			</tr>
			</thead>
			<tbody>
			{this.state.companyData.map(company =>
				<tr key={company.key}>
				<td>{company.name}</td>
				<td onClick={() =>this.handleClick(company.symbol)}>{company.symbol}</td>
				<td><button onClick={this.delete.bind(this, company.key)}>Remove Company</button></td>
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



export default Companylist

// 483:491
// 963:972