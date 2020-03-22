import React, { useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { Grid, Paper, Container, Breadcrumbs, Link, Typography } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { withRouter } from "react-router-dom";
import { compose } from 'recompose';
import {StateContext} from '../sesion/store';
import { consumerFirebase } from '../server';
import {openMensajePantalla} from '../actions/snackbarAction';
import { ThemePaper } from '../theme/themePaper';

const style = {
  cardGrid : {
      paddingTop: 8,
      paddingBottom: 8
  },
  paper: {
      backgroudColor: "#f5f5f5",
      padding: "20px",
      minHeight: 650
  },
  link: {
      display: "flex"
  },
  gridTextfield: {
      marginTop: "20px"
  },
  card: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
  },
  cardMedia: {
      paddingTop: "56.25%"
  },
  cardContent: {
      flexGrow: 1
  }
}

 const CrudDependencias = props => {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Surname', field: 'surname' },
      { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
      {
        title: 'Birth Place',
        field: 'birthCity',
        lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
      },
    ],
    data: [
      { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
      {
        name: 'Zerya Betül',
        surname: 'Baran',
        birthYear: 2017,
        birthCity: 34,
      },
    ]
  });


  useEffect(() => {
    getDataDependencies();
  },[props])

  async function getDataDependencies() {
    
  }

  return (
    <Container style={style.cardGrid}>
      <Paper style={style.paper}>
        <Grid item xs={12} sm={12} justify="space-between">
              <Breadcrumbs aria-label="breadcrumbs">
                  <Link color="inherit" style={style.link} href="/">
                      <HomeIcon />
                      Home
                  </Link>
                  <Typography color="textPrimary">Dependencias</Typography>
              </Breadcrumbs>                         
          </Grid>
        <Grid item xs={12} sm={12}>
          <MaterialTable
            title="Editable Example"
            columns={state.columns}
            data={state.data}
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    setState(prevState => {
                      const data = [...prevState.data];
                      data.push(newData);
                      return { ...prevState, data };
                    });
                  }, 600);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    if (oldData) {
                      setState(prevState => {
                        const data = [...prevState.data];
                        data[data.indexOf(oldData)] = newData;
                        return { ...prevState, data };
                      });
                    }
                  }, 600);
                }),
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    setState(prevState => {
                      const data = [...prevState.data];
                      data.splice(data.indexOf(oldData), 1);
                      return { ...prevState, data };
                    });
                  }, 600);
                }),
            }}
          />
        </Grid>
      </Paper>
    </Container>
  );
}

export default compose(consumerFirebase, withRouter)(CrudDependencias);