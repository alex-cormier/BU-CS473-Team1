import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class CommentEdit extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    emptyItem = {
        content: '',
        tutorial: null
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            item: this.emptyItem,
            csrfToken: cookies.get('XSRF-TOKEN')
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.commentId !== 'new') {
            try {
                const comment = await (await fetch(`/api/comments/${this.props.match.params.commentId}`, {credentials: 'include'})).json();
                this.setState({item: comment});
            } catch (error) {
                this.props.history.push(`/tutorials/${this.props.match.params.tutorialId}/${this.props.match.params.tutorialTitle}`);
            }
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item, csrfToken} = this.state;

        if (item.id) {
            await fetch('/api/comments/' + item.id, {
                method: 'PUT',
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
                credentials: 'include'
            });
        } else {
            await fetch(`/api/tutorials/${this.props.match.params.tutorialId}/comments`, {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
                credentials: 'include'
            });
        }
        this.props.history.push(`/tutorials/${this.props.match.params.tutorialId}/${this.props.match.params.tutorialTitle}`);
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.id ? 'Edit Task' : 'Add Task'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="content">Content</Label>
                        <Input type="text" name="content" id="content" value={item.content || ''}
                               onChange={this.handleChange} autoComplete="content"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to={"/tutorials/" + this.props.match.params.tutorialId +
                            "/" + this.props.match.params.tutorialTitle}>Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withCookies(withRouter(CommentEdit));