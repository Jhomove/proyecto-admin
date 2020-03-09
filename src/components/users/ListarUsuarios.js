import React, { Component } from 'react';
import { Container, Grid, List } from '@material-ui/core';

class ListarUsuarios extends Component {
    render() {
        return (
            <Container maxWidth="md">
                <Grid container spacing={2} justify="center">
                    <Grid item md={8} xs={12}>
                        <List dense={dense}>
                            
                        </List>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default ListarUsuarios;