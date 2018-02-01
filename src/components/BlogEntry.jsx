import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Flex, Box } from "grid-styled";
import Wrapper from "components/Wrapper";
import Link from "components/Link";
import Page from "components/Page";
import Container from "components/Container";

import Thumbnail from "containers/Thumbnail";

import { colors, shadows } from "utilities/style";

const EntryWrapper = styled(Container)`
	margin: 1rem auto;
	padding: 1rem;
	color: ${colors.primary};
	background-color: ${colors.backgroundContrast};
	box-shadow: ${shadows.y};

	h2 {
		margin: 0.5rem 0 0 0;
	}

	img {
		max-width: 100%;
		height: auto;
	}
`;

const BigDate = styled.time`
	font-size: 2rem;
`;
const SmallDate = styled.time`
	margin: 0.5rem 0;
	display: block;
`;

class BlogEntry extends React.PureComponent {
	render = () => {
		const { title, slug, content, thumbnailId, date } = this.props;

		return (
			<EntryWrapper>
				<Container>
					<Flex>
						<Box width={[1, 1, 2 / 3, 2 / 3]}>
							<Link to={`/post/${slug}`}>
								<BigDate>
									{date
										.getDate()
										.toString()
										.padStart(2, "0")}.
									{(date.getMonth() + 1).toString().padStart(2, "0")}.
								</BigDate>
								<Thumbnail id={thumbnailId} />
								<h2>{title}</h2>
								<SmallDate>
									{date
										.getDate()
										.toString()
										.padStart(2, "0")}.
									{(date.getMonth() + 1).toString().padStart(2, "0")}.
									{date.getFullYear()}
								</SmallDate>
								<div dangerouslySetInnerHTML={{ __html: content }} />
							</Link>
						</Box>
					</Flex>
				</Container>
			</EntryWrapper>
		);
	};
}

BlogEntry.propTypes = {
	title: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	thumbnailId: PropTypes.number.isRequired,
	content: PropTypes.string.isRequired,
	date: PropTypes.instanceOf(Date).isRequired
};

export default BlogEntry;
