import React, { useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { compose } from 'recompose';
import { consumerFirebase } from '../../server';
import { withRouter } from 'react-router-dom';
import MensajeBievenida from './tabs/MensajeBienvenida';
import MenuPersistente from './tabs/MenuPersistente';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const style = {
  paper: {
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
  },
  form: {
      width: "100%",
      marginTop: 20
  },
  submit: {
      marginTop: 15,
      marginBottom: 20,
      backgroundColor: '#253b80',
      color: '#fff'
  },
  container: {
      display: "flex",
      flexDirection: 'row',
      justifyContent: "center"
  },
  title: {
      display: "flex",
      justifyContent: "center"
  },
  section: {
      marginTop: 10
  }
};

const Interacciones = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [menuOpcion, cambiarMenuOpcion] = React.useState("bloque");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Bienvenida" {...a11yProps(0)} />
          <Tab label="Menú persistente" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
          {/* <MensajeBievenida style={style}/> */}
          <MenuPersistente style={style}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* <MenuPersistente style={style}/> */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
}

export default compose(consumerFirebase, withRouter)(Interacciones);