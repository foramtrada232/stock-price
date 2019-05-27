import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import firebase from '../Firebase';

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
			userEmail: ''
		};
		this.handleClick1 = this.handleClick1.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

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
		console.log("addCompany:",this.state.companySymbol)
		if (this.state.companySymbol) {
			return(
				<div className="hello">
				<p>{this.state.companySymbol}</p>
				<p>{this.state.companyName}</p>
				<button onClick={() =>this.updateCompany(this.state.companyName)}><Link to="/company-list"> Add Company </Link></button>
				</div>
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
				alert("already added");
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
					email: email
				});
				console.log("name:",this.state.companyName + "symbol:",this.state.companySymbol);
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			})

		}

	}

	

	displayData(){
		console.log(this.state.searchResponse)
		if(this.state.searchResponse){
			console.log("--if call--",this.state.searchResponse);
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
					<td><button>{data['2. name']}</button></td>
					<td><button onClick={() =>this.handleClick1(data)} >{data['1. symbol']}</button></td>
					</tr>
					)}
				</tbody>
				</table>

				</div>
				)
		}else{
			console.log("No data found");
			console.log(this.state.searchResponse);
		}
	}

	getApiData() {
		axios.get("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+this.state.value+"&apikey=Z51NHQ9W28LJMOHB")
		.then((data)=>{
			this.setState({
				searchResponse: data.data['bestMatches']});
			const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+this.state.companySymbol+"&name=apple&interval=5min&apikey= Z51NHQ9W28LJMOHB";
			fetch(url)
			.then(res => res.json())
			.then(res => {console.log(res); return res;})
			.then(res => {
				this.setState(prevState =>({
					array: [...prevState.array, res]
				}))  
				console.log("data====>",this.state.array);
			}).catch(error => console.log('hello error: ', error));
			axios.get(url, (error, response) => {
				console.log('error: ', error);
				console.log('response: ', response);
			});

		})
	}


	render() {
		console.log("user=-============>",this.state.user);
		return (

			<div className="container">

			<h1 className="content" style={{textAlign: 'center'}}>Welcome, Home!</h1>
			<center>
			<form onSubmit={this.handleSubmit}>
			<label>Company: </label>
			<input type="text" value={this.state.value} onChange={this.handleChange} />
			<input type="submit" value="Submit"/>
			</form>
			</center>
			{this.displayData()}
			{this.addComapny()}

			</div>

			)
	}
}



export default Suggestions