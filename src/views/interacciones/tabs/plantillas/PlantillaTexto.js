import React, { Component, useEffect } from 'react';
import { TextField, IconButton, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import HeightIcon from '@material-ui/icons/Height';
import { v4 as uuidv4 } from "uuid";

const PlantillaTexto = props => {
    useEffect(() => {
        console.log("props",props.element)
    })
        return props.selected[0].status ? (
            //</div> key={props.id}>
            <div>
                <Grid container direction="row" alignItems="center" justify="center" spacing={0}>
                    <Grid item xs={10} md={10}>
                        <TextField 
                            fullWidth
                            variant="outlined"
                            label="Añadir texto"
                            style = {{marginTop: 10}}
                            className = "text element parent"
                            value={props.element[0].title}
                            data-prop="title"
                            onBlur={props.save}
                            onChange={props.handleChange({ident: props.ident,type: props.type})}
                        />
                    </Grid>
                </Grid>
            </div>
        ) : null;
}

export default PlantillaTexto;