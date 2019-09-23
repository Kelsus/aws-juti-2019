import { API } from 'some-api-service';
import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Home.css';
import { getInit } from '../libs/utils';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			notes: []
		};
	}

	async componentDidMount() {
		try {
			const notes = await this.notes();
			this.setState({ notes });
		} catch (e) {
			alert(e);
		}

		this.setState({ isLoading: false })
	}

	notes() {
		return API.get('notes', '/notes', getInit());
	}

	renderNotesList(notes) {
		return [{}].concat(notes).map(
			(note, i) =>
				i !== 0
					? <LinkContainer
						key={note.noteId}
						to={`/notes/${note.noteId}`}
					>
						<ListGroupItem>
							{note.content.trim().split('\n')[0]}
							<p>{'Created: ' + new Date(note.createdAt).toLocaleString()}</p>
						</ListGroupItem>
					</LinkContainer>
					: <LinkContainer
						key="new"
						to="/notes/new"
					>
						<ListGroupItem>
							<h4>
								<b>{'\uFF0B'}</b> Create a new note
                            </h4>
						</ListGroupItem>
					</LinkContainer>
		);
	}

	renderNotes() {
		return (
			<div className="notes">
				<h1>Notes</h1>
				<ListGroup>
					{this.renderNotesList(this.state.notes)}
				</ListGroup>
			</div>
		);
	}

	render() {
		return (
			<div className="Home">
				{this.renderNotes() }
			</div>
		);
	}
}