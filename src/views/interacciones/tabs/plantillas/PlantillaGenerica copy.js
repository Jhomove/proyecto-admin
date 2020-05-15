import React, { Component, useEffect, useState } from 'react';
import { Card,CardActionArea, CardMedia, CardContent, TextField, Grid, CardActions, IconButton, Modal, Tab, Tabs, Box, Typography, RadioGroup, FormControlLabel, Radio, Container } from '@material-ui/core';
import ImageUploader from "react-images-upload";
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from '@material-ui/core/styles';
import Buttons from '../../../../components/expansionPanels/Buttons';
import Autocomplete from '@material-ui/lab/Autocomplete';
 
const useStyles = makeStyles({
    root: {
      maxWidth: '100%',
      marginTop: 20,
      marginBottom: 20
    },
    media: {
      height: 140,
    },
  });

const PlantillaGenerica = (props) => {

    const [ option, setOption ] = useState('postback');
    const [ optionBtn2, setOptionBtn2 ] = useState('postback');
    const [ optionBtn3, setOptionBtn3 ] = useState('postback');
    const classes = useStyles();

    const handleChange = (args) => event => {
        switch (args.btn) {
            case 1:
                setOption(event.target.value);
                break;
            case 2:
                setOptionBtn2(event.target.value);
                break;
            case 3:
                setOptionBtn3(event.target.value);
                break;
            default:
                break;
        }
      };

    let fotoKey = uuidv4();

    useEffect(()=> {
        console.log("props",props)
    })

        return props.selected[0].status ? (
            <div>
                <Grid container direction="column" alignItems="center" justify="center" spacing={0}>
                    <Grid item xs={11} md={11}>
                        <Card className={classes.root}>
                            <CardMedia
                                className={classes.media}
                                image={props.element[0].attachment.payload.elements[0].image_url}
                            />
                            <ImageUploader
                                withIcon={false}
                                key={fotoKey}
                                singleImage={false}
                                buttonTExt="Upload Image"
                                onChange={props.subirImagen({name: 'attachment.payload.elements.0.image_url', ident: props.ident})}
                                imgExtension={[".jpg",".gif",".png",".jpeg"]}
                                maxFileSize={5242880}
                            />
                            <CardActionArea>
                                <CardContent>
                                    <TextField
                                        name="attachment.payload.elements.0.default_action.url"
                                        onBlur={props.save}
                                        fullWidth
                                        data-prop="default_action"
                                        variant="outlined"
                                        label="Añadir url externa"
                                        className= "text element parent"
                                        style={{marginTop: 10}}
                                        value={props.element[0].attachment.payload.elements[0].default_action.url}
                                        onChange={props.handleChange({type: props.type, ident: props.ident})}
                                    />
                                    <TextField
                                        name="attachment.payload.elements.0.title"
                                        fullWidth
                                        data-prop='title'
                                        variant="outlined"
                                        label="Añadir título"
                                        className= "text element parent"
                                        style={{marginTop: 10}}
                                        value={props.element[0].attachment.payload.elements[0].title}
                                        onBlur={props.save}
                                        onChange={props.handleChange({type: props.type, ident: props.ident})}
                                    />
                                    <TextField
                                        name="attachment.payload.elements.0.subtitle"
                                        fullWidth
                                        data-prop="subtitle"
                                        variant="outlined"
                                        label="Añadir subtítulo"
                                        className= "text element parent"
                                        style={{marginTop: 10}}
                                        value={props.element[0].attachment.payload.elements[0].subtitle}
                                        onChange={props.handleChange({type: props.type, ident: props.ident})}
                                        onBlur={props.save}
                                    />
                                </CardContent>
                            </CardActionArea>
                            <p style={{margin:20}}>
                                En esta sección podrá configurar si así lo desea los botones de su plantilla generica, si no lo desea no los configure y su plantilla no aparecerá con los botones.
                            </p>
                            {
                            <IconButton edge="end" aria-label="add_button"  color="primary" size="small" disabled={props.element[0].attachment.payload.elements[0].buttons &&  props.element[0].attachment.payload.elements[0].buttons.length > 2 ? true : false} onClick={props.addButton({type: props.type, ident: props.ident})}>
                                Agregar botón
                            </IconButton>
                            }
                            <CardActions>
                                    {
                                        props.element[0].attachment.payload.elements[0].buttons !== undefined ? props.element[0].attachment.payload.elements[0].buttons.map((button, key) => {
                                            console.log("hola")
                                            return (<Buttons panelControl={`panel${key}-content`} panelId={`panel${key}a-header`} title={`Definir Botón ${key + 1}`}>
                                                <Grid container>
                                                    <Grid item xs={12} md={12}>
                                                        <TextField
                                                            name={`attachment.payload.elements.0.buttons.${key}.title`}
                                                            variant="outlined"
                                                            label="Añadir título del boton"
                                                            value={props.element[0].attachment.payload.elements[0].buttons[key].title ? props.element[0].attachment.payload.elements[0].buttons[key].title : ""}
                                                            onChange={props.handleChange({type: props.type, ident: props.ident})}
                                                            // onBlur={props.save}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={12}>
                                                        <RadioGroup aria-label="options" name="options-menu" value={option} onChange={handleChange({btn: 1})}>
                                                            <FormControlLabel value="postback" control={<Radio />} label="Postback" />
                                                            {option === 'postback' ?
                                                            <Container>
                                                                <Typography>
                                                                    1. Redireccionar al postback:
                                                                </Typography>
                                                                <Autocomplete
                                                                    id="combo-box-demo"
                                                                    options={formatPostbacks()}
                                                                    getOptionLabel={option => option.title}
                                                                    style={{ width: 200 }}
                                                                    renderInput={params => <TextField {...params} label={props.element[0].attachment.payload.elements[0].buttons[key].postback} variant="outlined" />}
                                                                    onChange={props.handleChange({type: props.type, ident: props.ident, typeButton: 'postback',name: `attachment.payload.elements.0.buttons.${key}.payload`})}
                                                                    // onBlur={props.save}
                                                                />
                                                            </Container>
                                                            : ''}
                                                            <FormControlLabel value="url" control={<Radio />} label="URL" />
                                                            {option === 'url' ?
                                                            <Container>
                                                                <Typography>
                                                                    1. Abrir URL:
                                                                </Typography>
                                                                <TextField
                                                                    name={`attachment.payload.elements.0.buttons.${key}.url`}
                                                                    variant="outlined"
                                                                    fullWidth 
                                                                    label="Añadir URL"
                                                                    value={props.element[0].attachment.payload.elements[0].buttons[key].url}
                                                                    onChange={props.handleChange({type: props.type, ident: props.ident, typeButton: 'web_url'})}
                                                                    // onBlur={props.save}
                                                                />
                                                            </Container>
                                                            : ''}
                                                        </RadioGroup>
                                                    </Grid>
                                                </Grid>
                                            </Buttons>)
                                        }) : null
                                    }
                                    {/* <Buttons panelControl="panel1a-content" panelId="panel1a-header" title="Botón 1">
                                        
                                        </Grid>
                                    </Buttons>
                                    <Buttons panelControl="panel2a-content" panelId="panel2a-header" title="Botón 2">
                                        <Grid container>
                                            <Grid item xs={12} md={12}>
                                                <TextField
                                                    name="attachment.payload.elements.0.buttons.1.title"
                                                    variant="outlined"
                                                    label="Añadir título del boton"
                                                    value={props.element[0].attachment.payload.elements[0].buttons[1].title}
                                                    onChange={props.handleChange({type: props.type, ident: props.ident})}
                                                    onBlur={props.save}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <RadioGroup aria-label="options" name="options-menu" value={optionBtn2} onChange={handleChange({btn: 2})}>
                                                    <FormControlLabel value="postback" control={<Radio />} label="Postback" />
                                                    {optionBtn2 === 'postback' ?
                                                    <Container>
                                                        <Typography>
                                                            1. Redireccionar al postback:
                                                        </Typography>
                                                        <Autocomplete
                                                            id="combo-box-demo"
                                                            options={formatPostbacks()}
                                                            getOptionLabel={option => option.title}
                                                            style={{ width: 200 }}
                                                            renderInput={params => <TextField {...params} label={props.element[0].attachment.payload.elements[0].buttons[1].postback} variant="outlined" />}
                                                            onChange={props.handleChange({type: props.type, ident: props.ident, typeButton: 'postback',name: "attachment.payload.elements.0.buttons.1.postback"})}
                                                            onBlur={props.save}
                                                        />
                                                    </Container>
                                                    : ''}
                                                    <FormControlLabel value="url" control={<Radio />} label="URL" />
                                                    {optionBtn2 === 'url' ?
                                                    <Container>
                                                        <Typography>
                                                            1. Abrir URL:
                                                        </Typography>
                                                        <TextField
                                                            name="attachment.payload.elements.0.buttons.1.url"
                                                            variant="outlined"
                                                            fullWidth 
                                                            label="Añadir URL"
                                                            value={props.element[0].attachment.payload.elements[0].buttons[1].url}
                                                            onChange={props.handleChange({type: props.type, ident: props.ident, typeButton: 'web_url'})}
                                                            onBlur={props.save}
                                                        />
                                                    </Container>
                                                    : ''}
                                                </RadioGroup>
                                            </Grid>
                                        </Grid>
                                    </Buttons>
                                    <Buttons panelControl="panel3a-content" panelId="panel3a-header" title="Botón 3"> */}
                                        {/* <Grid container>
                                            <Grid item xs={12} md={12}>
                                                <TextField
                                                    name="attachment.payload.elements.0.buttons.2.title"
                                                    variant="outlined"
                                                    label="Añadir título del boton"
                                                    value={props.element[0].attachment.payload.elements[0].buttons[2].title}
                                                    onChange={props.handleChange({type: props.type, ident: props.ident})}
                                                    onBlur={props.save}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <RadioGroup aria-label="options" name="options-menu" value={optionBtn3} onChange={handleChange({btn: 3})}>
                                                    <FormControlLabel value="postback" control={<Radio />} label="Postback" />
                                                    {optionBtn3 === 'postback' ?
                                                    <Container>
                                                        <Typography>
                                                            1. Redireccionar al postback:
                                                        </Typography>
                                                        <Autocomplete
                                                            id="combo-box-demo"
                                                            options={formatPostbacks()}
                                                            getOptionLabel={option => option.title}
                                                            style={{ width: 200 }}
                                                            renderInput={params => <TextField {...params} label={props.element[0].attachment.payload.elements[0].buttons[2].postback} variant="outlined" />}
                                                            onChange={props.handleChange({type: props.type, ident: props.ident, typeButton: 'postback',name: "attachment.payload.elements.0.buttons.2.postback"})}
                                                            onBlur={props.save}
                                                        />
                                                    </Container>
                                                    : ''}
                                                    <FormControlLabel value="url" control={<Radio />} label="URL" />
                                                    {optionBtn3 === 'url' ?
                                                    <Container>
                                                        <Typography>
                                                            1. Abrir URL:
                                                        </Typography>
                                                        <TextField
                                                            name="attachment.payload.elements.0.buttons.2.url"
                                                            variant="outlined"
                                                            fullWidth 
                                                            label="Añadir URL"
                                                            value={props.element[0].attachment.payload.elements[0].buttons[2].url}
                                                            onChange={props.handleChange({type: props.type, ident: props.ident, typeButton: 'web_url'})}
                                                            onBlur={props.save}
                                                        />
                                                    </Container>
                                                    : ''}
                                                </RadioGroup>
                                            </Grid>
                                        </Grid>
                                    </Buttons> */}
                            </CardActions>
                        </Card>
                    </Grid> 
                </Grid>
            </div>
        ) : null;
}

const formatPostbacks = () => {
    const internalPostbacks = JSON.parse(localStorage.getItem('postbacks'));
    const formatPostbacks = [];
    internalPostbacks.forEach(element => {
        formatPostbacks.push({title: element.key});
    });
    return formatPostbacks;
}

export default PlantillaGenerica;