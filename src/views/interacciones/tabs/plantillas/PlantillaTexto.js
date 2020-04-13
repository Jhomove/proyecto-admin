import React, { Component } from 'react';
import { TextField, IconButton, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import HeightIcon from '@material-ui/icons/Height';
import { v4 as uuidv4 } from "uuid";

const PlantillaTexto = props => {
        return (
            <div key={props.id}>
                <Grid container direction="row" alignItems="center" justify="center" spacing={0}>
                    <Grid item xs={10} md={10} justify="center">
                        <TextField 
                            name={props.ident}
                            fullWidth
                            data-id={props.id}
                            data-type={props.type}
                            variant="outlined"
                            label="Añadir texto"
                            style = {{marginTop: 10}}
                            className = "text element parent"
                            value={props.title}
                            data-prop="title"
                            onChange={props.handleChange}
                        />
                        <IconButton aria-label="move" color="primary" disabled={props.loading}>
                            <HeightIcon style={{marginLeft: '0', paddingLeft: '0'}}/>
                        </IconButton>
                        <IconButton aria-label="delete" color="secondary"
                            disabled={props.loading}>
                            <DeleteIcon style={{marginLeft: '0', paddingLeft: '0'}} onClick={props.handleDeleteBottomOption}/>
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
        );
}

export default PlantillaTexto;