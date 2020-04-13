import React, { useState, useContext, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardContent,TextField, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import { makeStyles } from '@material-ui/core/styles';
import MenuIzquierda from './bar_postback/MenuIzquierda';
import { v4 as uuidv4 } from 'uuid';
import { compose } from 'recompose';
import { consumerFirebase } from '../../../server';
import { withRouter } from 'react-router-dom';
import { StateContext } from '../../../sesion/store';
import { openMensajePantalla } from '../../../actions/snackbarAction';
import Sortable from 'sortablejs';
import SendIcon from '@material-ui/icons/Send';
import { establecerPostbacks, obtenerPostbacks } from '../../../actions/interactionsAction';
import { StateContextPostbacks } from '../../../postbacks/store';
import OptionsPostback from './options_postback';
import ProviderOptionsPostback from "../../../optionsPostback/store";
import PlantillaGenerica from './plantillas/PlantillaGenerica';
import PlantillaTexto from './plantillas/PlantillaTexto';



const drawerWidth = 240;
const useStyles = makeStyles(theme =>({
    root: {
        display: 'flex',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
          width: drawerWidth,
          flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
        top: '112px'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
  }));

const style = {
    btnSend: {
        background: '#2e3192',
        color: '#fff',
        fontSize: 10
    },
    btnDelete: {
        background: '#dc3545',
        color: '#fff',
        fontSize: 10
    }
}

const Postbacks = (props) => {
    const [ postbacks, setPostbacks ] = useState([]);
    const [ postbacksData, setPostbacksData ] = useState([]);
    const { dispatchPostbacks } = useContext(StateContextPostbacks);
    const [ elementSelected, setElementSelected ] = useState([]);
    const [ loading, setLoading ] = React.useState(false)
    const [ titleSection, setTitleSection ] = useState("");
    const [ isCreate, setIsCreate ] = useState(true);
    const classes = useStyles();
    const [ data, dispatch ] = useContext(StateContext);
    const [ firebase, setFirebase ] = useState();

    const handleFunction = e => {
        const type = e.currentTarget.dataset['type'];
        switch (type) {
            case 'text':
                setPostbacksData(prevState => [
                    ...prevState,
                    {
                        title: '',
                        type: type
                    }
                ])                
                break;
            case 'plantilla-generica':
                setPostbacksData(prevState => [
                    ...prevState,
                    {
                        title: '',
                        subtitle: '',
                        type: type,
                        image_url: '',
                        default_action: {

                        },
                        buttons: [

                        ]
                    }
                ])
                break;
            default:
                break;
        }
    }

    const handleDeleteBottomOption = e => {
        // const key = e.currentTarget.dataset.key;
        // const parent = document.getElementById(key).remove();
    }

    const [ elementsMenu, setElementsMenu ] = useState([
       {
           'text': 'Texto',
           'icon': <IconButton aria-label="add" data-type="text" onClick={handleFunction} key={uuidv4()}>
                        <TextFormatIcon style={{background: '#208ef0', color: '#fff'}}/>
                    </IconButton>
       } 
    ]);

    useEffect(() => {
        if(props.firebase !== firebase)
              setFirebase(props.firebase);
        getPostbacks();
    }, [props])

    useEffect(() => {
        var el = document.getElementById('content-options-selected');
        var sortable = Sortable.create(el,[]);
    },[elementSelected]);

    const handleAddAllBottomOptions = e => {
        if(titleSection !== ''){
            const formatTitleSection = titleSection.split(' ').join('_');
            const data = {
                [formatTitleSection]: postbacksData
            }
            if(!data[formatTitleSection].length){
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: 'No ha creado configuraciones para el postback actúal.'
                })
                return false;
            }
            if(isCreate){
                const match = postbacks.filter(postback => postback.title.toLowerCase() === titleSection.toLowerCase());
                if(!match.length){
                    setPostbacks(prevState => [
                        ...prevState,
                        { title: titleSection}
                    ])
                } else {
                    openMensajePantalla(dispatch,{
                        open: true,
                        mensaje: 'Ya existe una sección con el mismo nombre.'
                    })
                }
            } 
            saveData(data);
            setIsCreate(true);
        } else {
            openMensajePantalla(dispatch,{
                open: true,
                mensaje: 'Debe asignar un título a la sección.'
            }) 
        }
        setTitleSection('');
        setPostbacksData([]);
        setElementSelected([]);
    }

    const getPostbacks = async () => {
        try {
            let localPostbacks = JSON.parse(localStorage.getItem('postbacks'));

            if(localPostbacks === null){
                const callback = await obtenerPostbacks(firebase, '/api/read/configuracion/postbacks');
                localPostbacks = callback['data'];
                localPostbacks.forEach(element => {
                    const namePostback = Object.keys(element)[0];
                    const match = postbacks.filter(postback => postback.title === namePostback);
                    if(!match.length){
                        setPostbacks(prevState => [
                            ...prevState,
                            { title: namePostback }
                        ])
                        dispatchPostbacks({type: 'ADD_POSTBACKS', data: element})
                    }
                });
            }
            localPostbacks.forEach(element => {
                const namePostback = Object.keys(element)[0];
                    const match = postbacks.filter(postback => postback.title === namePostback);
                    if(!match.length){
                        setPostbacks(prevState => [
                            ...prevState,
                            { title: namePostback }
                        ])
                    }
            })
        } catch (error) {
            console.log("!error", error);
        }
    }

    const saveData = async data => {
        try {
            const callback = await establecerPostbacks(firebase, '/api/create/configuracion/postbacks', data);
            let mensaje = callback.mensaje;
            if(!isCreate)
                mensaje  = 'Se ha actualizado correctamente el postback.'
            openMensajePantalla(dispatch,{
                open: true,
                mensaje: mensaje
            }) 
        } catch (error) {
            console.log("error",error);
        }
    }

    const handleChange = event => {
        let elements = [...postbacksData];
        const id = event.target.closest('.parent').dataset.id;
        const type = event.target.closest('.parent').dataset.type;
        const prop = event.target.closest('.parent').dataset.prop;
        switch (type) {
            case 'text':
                elements[id][prop] = event.target.value;
                elements[id]['type'] = type;
                break;
            case 'plantilla-generica':
                if(prop === 'default_action')
                    elements[id][prop] = {
                        type: "web_url",
                        url: event.target.value,
                        messenger_extensions: "FALSE",
                        webview_height_ratio: "COMPACT"
                    }
                else
                    elements[id][prop] = event.target.value;
                elements[id][type] = type;
                break;
            default:
                break;
        }

        setPostbacksData(prevState => [
            ...elements
        ]);
        console.log("postbackData", postbacksData);
    }

    const drop = event => {
        event.preventDefault();
        let elements = [...postbacksData];
        const container = event.currentTarget;
        const DOMelements = container.getElementsByClassName('element');
        const index = [];
        for(const DOMelement of DOMelements){
            const id = DOMelement.dataset['id'];
            index.push(id);
        }
        const newElements = index.map(i => elements[i]);
        setPostbacksData(prevData => [
            ...newElements
        ])
    }

    const selectedPostback = event => {
        const titleSection = event.target.textContent.split(' ').join('_');
        setTitleSection(titleSection);
        const allData = JSON.parse(localStorage.getItem('postbacks'));
        const elements = allData.filter(ele => ele[titleSection])[0];
        setPostbacksData(prevState => [
            ...elements[titleSection]
        ])
        setIsCreate(false);
    }

    const handleSubmit = event => {event.preventDefault()}

    return (
        <div className={classes.root}>
            <MenuIzquierda styles={classes} data={postbacks} function={selectedPostback}/>
            <main className={classes.content} style={{paddingTop: '0'}}>
                <div className="title" style={props.style.title}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Postbacks
                    </Typography>
                </div>
                <div className="section">
                    <Typography paragraph>
                        En esta sección podrás configurar las secciones de respuesta ante una acción del usuario.
                    </Typography>
                    <Card>
                        <CardContent>
                            <Grid container>
                            <Grid item xs={10} md={10} style={{marginRight: 0}}>
                                <TextField 
                                    name="title-section"
                                    fullWidth
                                    label="Agregue un identificador para la sección"
                                    value={titleSection}
                                    onChange={e => setTitleSection(e.target.value)}
                                    style={{ marginTop: 10}}
                                    disabled={!isCreate}
                                />
                            </Grid>
                            <Grid item xs={2} md={2} style={{marginTop: 30}}>
                                <Grid container>
                                        <IconButton aria-label="submit" color="primary" disabled={loading} style={{marginRight: '0', paddingRight: '0'}} onClick={handleAddAllBottomOptions}>
                                            <SendIcon/>
                                        </IconButton>
                                        <IconButton aria-label="delete-all" color="secondary" disabled={loading} style={{marginLeft: 10, paddingLeft: '0'}}>
                                            <DeleteIcon/>
                                        </IconButton>
                                </Grid>
                            </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <form onSubmit={handleSubmit}>
                        <Card style={props.style.form}>
                            <CardContent style={{maxHeight:150,overflowY: 'auto'}}>
                                <Typography color="textSecondary" gutterBottom>
                                    Añadir nueva opción
                                </Typography>
                                {
                                    <div id="content-options-selected" onDrop={drop}>
                                        {
                                            postbacksData.map((val,idx) => {
                                                let ident = `element-${idx}`;
                                                let html = '';
                                                switch (val.type) {
                                                    case 'text':
                                                        return <PlantillaTexto 
                                                            name={ident}
                                                            id={idx}
                                                            type={val.type}
                                                            value={val.title}
                                                            handleChange={handleChange}
                                                            loading={loading}
                                                            handleDeleteBottomOption={handleDeleteBottomOption}
                                                        />
                                                        // html = 
                                                        //     <div key={idx}>
                                                        //         <TextField 
                                                        //             name={ident}
                                                        //             fullWidth
                                                        //             data-id={idx}
                                                        //             data-type={val.type}
                                                        //             variant="outlined"
                                                        //             label="Añadir texto"
                                                        //             style = {{marginTop: 10}}
                                                        //             className = "text element"
                                                        //             value={val.title}
                                                        //             onChange={handleChange}
                                                        //         />
                                                        //         <IconButton aria-label="move" color="primary" disabled={loading}>
                                                        //             <HeightIcon style={{marginLeft: '0', paddingLeft: '0'}}/>
                                                        //         </IconButton>
                                                        //         <IconButton aria-label="delete" color="secondary"
                                                        //             disabled={loading}>
                                                        //             <DeleteIcon style={{marginLeft: '0', paddingLeft: '0'}} onClick={handleDeleteBottomOption}/>
                                                        //         </IconButton>
                                                        //     </div>
                                                        ;
                                                        break;
                                                    case 'plantilla-generica':
                                                        return <PlantillaGenerica 
                                                            key={idx}
                                                            name={ident}
                                                            id={idx}
                                                            type={val.type}
                                                            value={val.title}
                                                            handleChange={handleChange}
                                                            default_action={val.default_action}
                                                        />
                                                        // break;
                                                    default:
                                                        break;
                                                }
                                                // return html;
                                            })
                                        }
                                    </div>
                                }
                            </CardContent>
                            <ProviderOptionsPostback>
                                <OptionsPostback handleFunction={handleFunction}/>
                            </ProviderOptionsPostback>
                        </Card>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default compose(consumerFirebase, withRouter)(Postbacks);
//compose(consumerFirebase, withRouter)