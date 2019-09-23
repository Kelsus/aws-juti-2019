import { API } from "some-api-service";
import React, { Component } from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './NewNote.css';
import { getInit } from "../libs/utils";

export default class NewNote extends Component {
	constructor(props) {
		super(props);
		this.file = null;
		this.state = {
			isLoading: null,
			content: ''
		};
	}

	validateForm = event => {
		return this.state.content.length > 0;
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}


	handleFileChange = event => {
		this.file = event.target.files[0];
	}

	handleSubmit = async event => {
		event.preventDefault();

		this.setState({ isLoading: true });

		try {
			await this.createNote({
				content: this.state.content
			});
			this.props.history.push('/');
		} catch (e) {
			alert(e);
			this.setState({ isLoading: false });
		}
	}

	createNote(note) {
		return API.post('notes', '/notes', getInit({ body: note }))
	}

	render() {
		const { content, isLoading } = this.state;
		return (
			<div className="NewNote">
				<form onSubmit={this.handleSubmit}>
					<FormGroup controlId="content">
						<FormControl
							onChange={this.handleChange}
							value={content}
							as="textarea"
						/>
					</FormGroup>
					<LoaderButton
						block
						variant="primary"
						bsSize="large"
						disabled={!this.validateForm()}
						type="submit"
						isLoading={isLoading}
						text="Create"
						loadingText="Creating…"
					/>
				</form>
			</div>
		);
	}
}