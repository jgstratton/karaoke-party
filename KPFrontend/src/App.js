import React, { Component } from 'react';
import Menu from './Menu';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
export default class App extends Component {
	static displayName = App.name;

	constructor(props) {
		super(props);
		this.state = { forecasts: [], loading: true };
	}

	componentDidMount() {
		this.populateWeatherData();
	}

	static renderForecastsTable(forecasts) {
		return (
			<table className='table table-striped' aria-labelledby="tabelLabel">
				<thead>
					<tr>
						<th>Date</th>
						<th>Temp. (C)</th>
						<th>Temp. (F)</th>
						<th>Summary</th>
					</tr>
				</thead>
				<tbody>
					{forecasts.map(forecast =>
						<tr key={forecast.date}>
							<td>{forecast.date}</td>
							<td>{forecast.temperatureC}</td>
							<td>{forecast.temperatureF}</td>
							<td>{forecast.summary}</td>
						</tr>
					)}
				</tbody>
			</table>
		);
	}

	render() {
		let contents = this.state.loading
			? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
			: App.renderForecastsTable(this.state.forecasts);

		return (
			<div class="container" style={{padding: "5px",maxWidth: "900px"}}>
				<Menu/>
				<Card>
					<Card.Body>
						<Card.Title>Now Playing</Card.Title>
						<Card.Text class="text-warning">
							Nothing is playing right now
						</Card.Text>
						<Button variant="primary">Go somewhere</Button>
					</Card.Body>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Next Song</Card.Title>
						<Card.Text>
							<p class="text-warning">
								Johnny Cash (Hurt) - Karaoke Version
							</p>
							<FontAwesomeIcon icon={faMicrophone} fixedWidth/> Mr. Singer
						</Card.Text>
						<Button variant="primary">Go somewhere</Button>
					</Card.Body>
				</Card>
				<p>This component demonstrates fetching data from the server.</p>
				{contents}
			</div>
		);
	}

	async populateWeatherData() {
		const response = await fetch('weatherforecast');
		const data = await response.json();
		this.setState({ forecasts: data, loading: false });
	}
}
