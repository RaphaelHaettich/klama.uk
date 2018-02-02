import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push } from "react-router-redux";
import styled from "styled-components";

import { Flex, Box } from "grid-styled";

import Link from "components/Link";
import Wrapper from "components/Wrapper";
import PageWrapper from "components/Page";
import Container from "components/Container";
import BlogEntry from "components/BlogEntry";

import { fetch as fetchEvent } from "actions/event";
import { fetchAll as fetchEventTypes } from "actions/event-type";
import { getEventById, getEventTypes } from "reducers";

import { colors } from "utilities/style";

const EventWrapper = styled.div`
	padding: 1rem 0;
`;

const Table = styled.table`
	border-collapse: collapse;

	td:first-child {
		${({ firstColumn }) => (firstColumn ? `min-width:${firstColumn}rem;` : "")};
	}

	thead th {
		padding: 0.5rem 0.5rem 0.5rem 0.25rem;
		background-color: ${colors.primary};
		color: #fff;
		text-align: left;
	}

	th,
	td {
		padding: 0.25rem 0.5rem 0 0;
	}
`;

class Event extends React.PureComponent {
	componentWillMount = () => {
		const { fetchEvent, eventTypes, fetchEventTypes } = this.props;

		fetchEvent();

		if (eventTypes.length === 0) {
			fetchEventTypes();
		}
	};
	render = () => {
		const {
			slug,
			event: {
				title = "",
				content = "",
				dateFrom = "",
				dateTo = "",
				location = "",
				artists = [],
				eventTypeIds = []
			},
			eventTypes
		} = this.props;

		return (
			<Wrapper slider header footer>
				<PageWrapper
					title={title}
					year={new Date(dateFrom).getFullYear().toString()}
				>
					<Container>
						<EventWrapper>
							<h2>Infos</h2>
							<Table firstColumn={2}>
								<tbody>
									<tr>
										<td>Von</td>
										<td>{new Date(dateFrom).toLocaleString()}</td>
									</tr>
									<tr>
										<td>Bis</td>
										<td>{new Date(dateTo).toLocaleString()}</td>
									</tr>
									<tr>
										<td>Typ</td>
										<td>
											{eventTypes
												.filter(eventType =>
													eventTypeIds.includes(eventType.id)
												)
												.map(eventType => eventType.name)
												.join(", ")}
										</td>
									</tr>
									<tr>
										<td>Ort</td>
										<td>{location}</td>
									</tr>
								</tbody>
							</Table>
							<h2>Acts</h2>
							<Table>
								<thead>
									<tr>
										<th>Name</th>
										<th>Von</th>
										<th>Bis</th>
									</tr>
								</thead>
								<tbody>
									{artists.map(({ id, name, dateFrom, dateTo }) => {
										return (
											<tr key={id + "-" + dateFrom}>
												<td>{name}</td>
												<td>{new Date(dateFrom).toLocaleString()}</td>
												<td>{new Date(dateTo).toLocaleString()}</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
							<h2>Beschreibung</h2>
							<div dangerouslySetInnerHTML={{ __html: content }} />
						</EventWrapper>
					</Container>
				</PageWrapper>
			</Wrapper>
		);
	};
}

const mapStateToProps = (state, { match: { params: { eventSlug } } }) => ({
	slug: fetchEvent,
	event: getEventById(state, eventSlug) || {},
	eventTypes: getEventTypes(state) || []
});

const mapDispatchToProps = (
	dispatch,
	{ match: { params: { eventSlug } } }
) => ({
	fetchEvent() {
		return dispatch(fetchEvent(eventSlug));
	},
	fetchEventTypes() {
		return dispatch(fetchEventTypes());
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Event));