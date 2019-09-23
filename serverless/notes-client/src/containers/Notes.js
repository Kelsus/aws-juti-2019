import React, { Component } from 'react';
import { API } from 'some-api-service';
import { FormGroup, FormControl } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Notes.css';
import { getInit } from '../libs/utils';

export default class Notes extends Component {
	constructor(props) {
		super(props);

		this.file = null;
		this.state = {
			note: null,
			content: '',
			isLoading: false,
			isDeleting: false,
		};
	}

	async componentDidMount() {
		let note;
		try {
			note = await this.getNote();
			const { content } = note;
			this.setState({
				note,
				content
			});
		} catch (e) {
			alert(e);
		}
	}

	getNote() {
		return API.get('notes', `/notes/${this.props.match.params.id}`, getInit());
	}

	saveNote(note) {
		return API.put('notes', `/notes/${this.props.match.params.id}`, getInit({ body: note }));
	}

	deleteNote() {
		return API.del('notes', `/notes/${this.props.match.params.id}`, getInit());
	}

	validateForm() {
		return this.state.content.length > 0;
	}

	formatFilename(str) {
		return str.replace(/^\w+-/, '');
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = async event => {
		event.preventDefault();

		this.setState({ isLoading: true });

		try {
			await this.saveNote({
				content: this.state.content
			});
			this.props.history.push('/');
		} catch (e) {
			alert(e);
			this.setState({ isLoading: false });
		}
	}

	handleDelete = async event => {
		event.preventDefault();

		const confirmed = window.confirm(
			'Are you sure you want to delete this note?'
		);

		if (!confirmed) {
			return;
		}

		this.setState({ isDeleting: true });

		try {
			await this.deleteNote();
			this.props.history.push('/');
		} catch (e) {
			alert(e);
			this.setState({ isDeleting: false });
		}
	}

	render() {
		const { content, note, isLoading, isDeleting } = this.state;
		return (
			<div className="Notes">
				{note &&
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
							text="Save"
							loadingText="Saving..."
						/>
						<LoaderButton
							block
							variant="danger"
							bsSize="large"
							isLoading={isDeleting}
							onClick={this.handleDelete}
							text="Delete"
							loadingText="Deleting…"
						/>
					</form>}
			</div>
		);
	}
}