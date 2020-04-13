import React from 'react';
import { Drawer, Typography, Divider, List, ListItem, ListItemText, TextField, InputLabel, FilledInput, Grid, IconButton, Button } from '@material-ui/core';
import { useState } from 'react';
import { useEffect } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';

const style = {
    orderIcon: {
        fontSize: '10px',
        position: 'absolute',
        color: 'black'
    },
    button: {
        padding: '5px',
        background: '#6c757d',
        color: '#fff'
    },
    btnSend: {
        background: '#2e3192',
        color: '#fff',
        fontSize: 10
    }
}

function MenuIzquierda(props) {
    const [ data, setData ] = useState([]);
    const [ componentList, setComponentList ] = useState();
    const [ textSearch, setTextSearch ] = useState("");
    const [ loading, setLoading ] = React.useState(false);

    useEffect(() => {
        let elements = {};
        if(data.length > 0){
            elements = data.map((ele,ind) => (
                <ListItem button key={ind}>
                    <ListItemText primary={ele.title.split('_').join(' ')}/>
                </ListItem>
            ));
        } else {
            elements = props.data.map((ele,ind) => (
                <ListItem button key={ind} data-title={ele.title}>
                    <ListItemText primary={ele.title.split('_').join(' ')} onClick={props.function} />
                </ListItem>
            ));
        }
        setComponentList(elements);
    },[props,data]);

    const handleTextSearch = e => {
        setTextSearch(e.target.value);
        const match = props.data.filter(val => {
            const title = val.title.toLowerCase();
            const text = e.target.value.toLowerCase();
            let response = null;
            if(title.search(text) !== -1){
                response = val;
            }
            return response;
        })
        setData(prevState => match);
    }
    return (
        <nav className={props.styles.drawer} aria-label="mailbox folders">
            <Drawer 
                classes={{
                paper: props.styles.drawerPaper,
                }}
                variant="persistent"
                anchor="left"
                open={true}
                >
                    <Typography variant="h6" align="center">
                        Lista de Postbacks
                    </Typography>
                    <Divider />
                    <div style={{ maxHeight:380, minHeight:380 ,overflowY: 'auto'}}>
                        <TextField 
                            value={textSearch} 
                            onChange={handleTextSearch}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                                ),
                            }}
                        />
                        <List>
                            {
                                componentList
                            }
                        </List>
                    </div>
            </Drawer>
        </nav>
    );
}

export default MenuIzquierda;