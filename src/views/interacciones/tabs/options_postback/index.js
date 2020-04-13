import React, { Component, useState } from 'react';
import { Grid, IconButton, Card, CardActions } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';

function OptionsPostback(props){
    const [ elementsMenu, setElementsMenu ] = useState([
        {
            'text': 'Texto',
            'icon': <IconButton aria-label="add" data-type="text" onClick={props.handleFunction} key={uuidv4()}>
                         <TextFormatIcon style={{background: '#208ef0', color: '#fff'}}/>
                     </IconButton>
        },
        {
            text: 'Plantilla Genérica',
            icon : <IconButton aria-label="generic" data-type="plantilla-generica" onClick={props.handleFunction} key={uuidv4()}>
                <ArtTrackIcon style={{background: '#208ef0', color: '#fff'}}/>
            </IconButton>
        }
     ]);

    return (
        <CardActions>
            <Grid item xs={10} md={10}>
                {
                    elementsMenu.map(element => element.icon)
                }
            </Grid>
        </CardActions>
    );
}

export default OptionsPostback;