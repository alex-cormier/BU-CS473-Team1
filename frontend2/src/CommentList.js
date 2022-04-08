import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class CommentList extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {comments: [], csrfToken: cookies.get('XSRF-TOKEN'), isLoading: true};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch(`/api/tutorials/${this.props.match.params.tutorialId}/comments`, {credentials: 'include'})
            .then(response => response.json())
            .then(data => this.setState({comments: data, isLoading: false}))
            .catch(() => this.props.history.push('/tutorials'));
    }

    async remove(id) {
        await fetch(`/api/comments/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': this.state.csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(() => {
            let updatedComments = [...this.state.comments].filter(i => i.id !== id);
            this.setState({comments: updatedComments});
        });
    }

    render() {
        const {comments, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const commentList = comments.map(comment => {
            return <tr key={comment.id}>
                <td style={{whiteSpace: 'nowrap'}}>{comment.content}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/tutorials/" +
                            this.props.match.params.tutorialId + "/" + this.props.match.params.tutorialTitle + "/" + comment.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(comment.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-end">
                        <Button color="success" tag={Link} to={"/tutorials/" + this.props.match.params.tutorialId +
                            "/" + this.props.match.params.tutorialTitle + "/new"}>Add Task</Button>
                    </div>
                    <h3>{this.props.match.params.tutorialTitle} Tasks</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="90%">Comments</th>
                            <th width="10%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {commentList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(CommentList));