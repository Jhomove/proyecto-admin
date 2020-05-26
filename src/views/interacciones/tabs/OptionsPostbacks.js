import React, { useEffect, useContext } from 'react';
import { Grid, IconButton, Card, CardActions, Tooltip, Typography, Box, List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import { useState } from 'react';
import PlantillaTexto from './plantillas/PlantillaTexto';
import PlantillaGenerica from './plantillas/PlantillaGenerica';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { establecerPostbacks } from '../../../actions/interactionsAction';
import { openMensajePantalla } from '../../../actions/snackbarAction';
import { StateContextPostbacks } from '../../../postbacks/store';
import { StateContext } from '../../../sesion/store';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const style = {
    container: {
        background: '#7216af',
        width: '100%',
        maxHeight: `inherit`,
        flex: 1,
        display: 'flex'
    },
    menuLeft: {
        flex: 1,
        background: '#fff',
        height: 'inherit',
        display: 'flex',
        flexDirection: 'column'
    },
    optionsMenuLeft: {
        maxHeight: window.innerHeight - 64 - 48 - 50,
        flex: 10,
        borderBottom: '1px solid black',
        overflow: 'auto',
    },
    footerMenuLeft: {
      flex:1,
      display: 'flex',
      justifyContent: 'space-around'
    },
    menuRight: {
        flex: 0.5,
        background: '#fff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    dashboard: {
        flex: 8,
        background: '#C4C4C4',
        height: window.innerHeight - 64 - 48 ,
        overflow: 'auto'
    }
}
const OptionsPostbacks = props => {
    const [selected, setSelected] = useState([
        {status: false, ident: 'text'},
        {status: false, ident: 'generic'},
        {status: false, ident: 'buttons'}
    ]);
    const [ elements, setElements ] = useState([]);
    const [ identSelected, setIdentSelected ] = useState();
    const { postbacks,dispatchPostbacks } = useContext(StateContextPostbacks);
    const [ data, dispatch ] = useContext(StateContext);

    useEffect(() => {
        console.log("elements",props.data.content)
        setElements(prevState => props.data.content)
        if(props.data.content !== undefined && props.data.content.length){
            openSelectedOption({dataType: props.data.content[0].type, ident: props.data.content[0].ident})
        }
    },[props.data])

    const openSelectedOption = args => {
        console.log("args",args)
        setIdentSelected(args.ident);
        const aux = selected.map(ele => {
            if(ele.ident === args.dataType){
                ele.status = true;
                return ele;
            } else {
                ele.status = false;
                return ele;
            }
        })
        setSelected(aux);
    }

    const selectedOption = event => {
        const dataType = event.target.closest('button').dataset.type;
        let name = "";
        switch (dataType) {
            case "text":
                const elementsText = elements.filter(elem => elem.type === 'text');
                name = `text_${elementsText.length + 1}`;
                setIdentSelected(name);
                setElements(prevState => [
                    ...prevState,
                    {
                        title: '',
                        type: dataType,
                        ident: name
                    }
                ])
                break;
            case "generic":
                const elementsGeneric = elements.filter(elem => elem.type === 'generic');
                name = `generic_${elementsGeneric.length + 1}`;
                setIdentSelected(name);
                setElements(prevState => [
                    ...prevState,
                    {
                        ident: name,
                        type: dataType,
                        attachment: {
                            type:"template",
                            payload: {
                                template_type: "generic",
                                elements: [
                                    {
                                        title: '',
                                        image_url: '',
                                        subtitle: '',
                                        default_action: {
                                            type: 'web_url',
                                            url: '',
                                            messenger_extensions: false,
                                            webview_height_ratio: "tall",
                                        },
                                        buttons: [
                                            {
                                                type: "",
                                                title: "",
                                            },
                                            {
                                                type: "",
                                                title: ""
                                            },
                                            {
                                                type: "",
                                                title: ""
                                            }
                                        ]
                                    },
                                ]
                            }
                        }
                    }
                ])
                break;
            default:
                break;
        }
        openSelectedOption({dataType: dataType, ident: name});
    }

    const handleChange = args => event => {
        console.log("args",args)
        switch (args.type) {
            case "text":
                console.log("event",event.target.value)
                const updateElement = elements.map(elem => {
                    console.log("elem",elem)
                    if(elem.ident === args.ident){
                        elem.title = event.target.value;
                        return elem;
                    }
                    return elem;
                });
                setElements(prevState => updateElement)       
                break;
            case "generic":
                const element = elements.filter(elem => elem.ident === args.ident)[0];
                const keys = event.target.name !== undefined ? event.target.name.split('.') : args.name.split('.');
                const newValue = args.typeButton === 'postback' ? event.target.textContent : event.target.value;
                updateProp(element,keys,newValue,args.typeButton);
                const newElements = elements.map(elem => {
                    if(elem.ident === args.ident){
                        return element;
                    }
                    return elem;
                })
                setElements(prevState => newElements)
                break;
            default:
                break;
        }
    }

    const updateProp = (obj,keys,newValue, type = '') => {
        try {
            let aux = obj;
            keys.map((k,i) => {
                console.log("keys",keys[keys.length - 1])
                if(k === keys[keys.length - 1]){
                    if(type !== '')
                        aux['type'] = type;
                    if(type !== '' && type === 'postback'){
                        delete aux['url']
                    } else if(type !== '' && type === 'web_url'){
                        delete aux['payload']
                    }
                    if(type !== '' && type === 'postback' && i === keys.length - 1){
                        aux['payload'] = newValue;
                    }else{
                        aux[k] = newValue;
                    }
                }
                aux = aux[k] !== undefined && aux[k] !== null ? aux[k] : aux;
            })
        } catch (error) {
            console.error("Ha ocurrido un error:", error);
            return false;
        }
        return true;
    }

    const subirImagen = args => imagen => {
        const imagenLocal = imagen[0];
        const name = `${props.data.key}_${args.ident}`;
        props.firebase.guardarDocumento(name,imagenLocal).then(metadata => {
            props.firebase.devolverDocumento(name).then(urlFoto => {
                const element = elements.filter(elem => elem.ident === args.ident)[0];
                const keys = args.name.split('.');
                updateProp(element,keys,urlFoto)
                const newElements = elements.map(elem => {
                    if(elem.ident === args.ident){
                        return element;
                    }
                    return elem;
                })
                setElements(prevState => newElements)
                handleSave();
            })
        });
    }

    const handleDelete = args => event => {
        if(identSelected === args.ident){
            const index = args.ident.indexOf("_");
            const type = args.ident.slice(0,index);
            const updateSelected = selected.map(elem => {
                if(elem.ident === type){
                    elem.status = false;
                    return elem;
                }
                return elem;
            })
            setSelected(prevState => updateSelected)
            setIdentSelected("");
        }
        const updateElements = elements.filter(elem => elem.ident !== args.ident);
        setElements(prevState => updateElements);
    }

    const handleSave = async event => {
        const aux_data = {...props.data};
        aux_data.content = elements;
        const callback = await establecerPostbacks(props.firebase,'api/update/postback',aux_data);
        if(callback.status === 200){
            dispatchPostbacks({type: 'UPDATE_POSTBACKS', data: aux_data})
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Se ha actualizado correctamente el postback.'
            })
        } else {
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Ha ocurrido un error al actualizar el postback.'
            })
        }
    }

    const handleSelectedOption = args => event => {
        const elementSelected = elements.filter(elem => elem.ident === args.ident)
        openSelectedOption({dataType: elementSelected[0].type, ident: elementSelected[0].ident })
    }

    const handleDeleteSelectedOption = args => async event => {
        const name = `${props.data.key}_${args.ident}`;
        const auxData = {...props.data};
        const auxElements = elements.filter(elem => elem.ident !== args.ident)
        console.log("auxElements",auxElements)
        setElements(prevState => auxElements);
        console.log("elements",elements)
        if(auxElements.length > 0 && auxElements[0] !== undefined){
            openSelectedOption({dataType: auxElements[0].type, ident: auxElements[0].ident})
        } else {
            openSelectedOption({dataType: "none", ident: "none"})
        }
        auxData.content = auxElements;
        const callback = await establecerPostbacks(props.firebase, 'api/update/postback', auxData);
        if(callback.status === 200){
            await props.firebase.eliminarDocumento(name);
            dispatchPostbacks({type: 'UPDATE_POSTBACKS', data: auxData})
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Se ha eliminado correctamente la opción.'
            })
        } else {
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Ha ocurrido un error al eliminar la opción.'
            })
        }
    }

    const addButton = args => event => {
        const updateElements = elements.map(elem => {
            if(elem.ident === args.ident){
                if(elem.attachment.payload.elements[0].buttons === undefined){
                    elem.attachment.payload.elements[0].buttons = [];
                    elem.attachment.payload.elements[0].buttons.push({});
                }
                return elem;
            }
        });
        setElements(prevState => updateElements)
    }

    return (
        <div style={style.container}>
            <div style={style.menuLeft}>
                <div style={style.optionsMenuLeft}>
                    <List>
                        {
                            elements.map((elem,key) => (
                                <ListItem key={key}>
                                    <ListItemText 
                                        primary={elem.ident}
                                        onClick={handleSelectedOption({ident: elem.ident})}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete"  color="secondary" onClick={handleDeleteSelectedOption({ident: elem.ident})}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))
                        }
                    </List>
                </div>
                <div style={style.footerMenuLeft}>
                    <Tooltip title="Atrás" aria-label="back">
                        <IconButton aria-label="back" color="primary" onClick={props.handleClose} data-type="list">
                            <ArrowBackIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div style={style.dashboard}>
                <PlantillaTexto
                    selected={selected.filter(ele => ele.ident === 'text')}//Parametro para saber si la opción esta seleccionada y renderizar
                    ident={identSelected}//Identificador del elemento seleccionado
                    type='text'//Tipo de opción
                    element = {elements.filter(elem => elem.ident === identSelected)}//Datos del elemento seleccionado
                    handleChange={handleChange}//función para cambiar el value del titulo
                    // loading={loading}
                    save={handleSave}
                />
                <PlantillaGenerica
                    selected={selected.filter(ele => ele.ident === 'generic')}
                    ident={identSelected}
                    type='generic'
                    element = {elements.filter(elem => {
                        return elem.ident === identSelected})}
                    handleChange={handleChange}
                    subirImagen={subirImagen}
                    save={handleSave}
                    addButton={addButton}
                />
            </div>
            <div style={style.menuRight}>
                <Tooltip title="Campo texto" aria-label="text">
                    <IconButton aria-label="add" data-type="text" onClick={selectedOption} key={uuidv4()}>
                        <TextFormatIcon style={{background: '#208ef0', color: '#fff'}}/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Botones" aria-label="buttons">
                    <IconButton aria-label="add" data-type="buttons" onClick={selectedOption} key={uuidv4()}>
                        <PlayCircleFilled style={{background: '#208ef0', color: '#fff'}}/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Plantilla generica" aria-label="generic">
                    <IconButton aria-label="generic" data-type="generic" onClick={selectedOption} key={uuidv4()}>
                        <ArtTrackIcon style={{background: '#208ef0', color: '#fff'}}/>
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

export default OptionsPostbacks;
