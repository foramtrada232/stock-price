import React, { Component } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts'


class Graph extends Component {
  constructor() {
    super();
    
    this.state = {
     grapharray: [],
    };
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
        }).catch(error => console.log('hello error: ', error));
    axios.get(url, (error, response) => {
      console.log('error: ', error);
      console.log('response: ', response);
    });
    this.graphDisplay();
  }  
  graphDisplay(){
    var dataSeries = this.state.grapharray;
    var ts2 = 1484418600000;
    var dates = [];
    for (var i = 0; i < 120; i++) {
      ts2 = ts2 + 86400000;
      var innerArr = [ts2, dataSeries.value];
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
      return (
      <div className="container">
      <div id="chart">
      <ReactApexChart options={options} series={series} type="area" height="350" />
      </div>
     hello
      </div>
      );
  }

  
  render() {
    
    return (
      <div className="container">
     {this.handleClick()}
     hello
      </div>
      );
    }
  }

  export default Graph;

