import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class TutorialList extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {tutorials: [], csrfToken: cookies.get('XSRF-TOKEN'), isLoading: true};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/tutorials', {credentials: 'include'})
            .then(response => response.json())
            .then(data => this.setState({tutorials: data, isLoading: false}))
            .catch(() => this.props.history.push('/tutorials'));
    }

    async remove(id) {
        await fetch(`/api/tutorials/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': this.state.csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(() => {
            let updatedTutorials = [...this.state.tutorials].filter(i => i.id !== id);
            this.setState({tutorials: updatedTutorials});
        });
    }

    render() {
        const {tutorials, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const tutorialList = tutorials.map(tutorial => {
            return <tr key={tutorial.id}>
                <td>
                    <Button color="link" tag={Link} to={"/tutorials/" + tutorial.id + "/" + tutorial.title}>
                        {tutorial.title}
                    </Button>
                </td>
                <td style={{whiteSpace: 'nowrap'}}>{tutorial.description}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/tutorials/" + tutorial.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(tutorial.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-end">
                        <Button color="success" tag={Link} to="/tutorials/new">Add Projects</Button>
                    </div>
                    <h3>My Projects</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Name</th>
                            <th width="70%">Description</th>
                            <th width="10%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tutorialList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(TutorialList));