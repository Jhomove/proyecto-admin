import React, { useState, useContext, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, CardActions, TextField, RadioGroup, AppBar, Tabs, Tab, FormControlLabel, Radio, IconButton, ButtonGroup, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { openMensajePantalla } from '../../../actions/snackbarAction';
import { StateContext } from '../../../sesion/store';
import SendIcon from '@material-ui/icons/Send';
import { establecerMenuPersistente, obtenerConfiguracionMenuPersistente } from '../../../actions/interactionsAction';
import { compose } from 'recompose';
import { consumerFirebase } from '../../../server';
import { withRouter } from 'react-router-dom';
import { StateContextPostbacks } from '../../../postbacks/store';
import { format } from 'morgan';

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
        color: '#fff'
    }
}

const MenuPersistente = (props) => {

    const [ menus, setMenus ] = useState([]);
    const [ data, dispatch ] = useContext(StateContext);
    const [ iconsOptions, setIconsOptions ] = useState([]);
    const { postbacks } = useContext(StateContextPostbacks);
    const [ btnTitle, setBtnTitle ] = useState();
    const [ option, setOption ] = React.useState('postback');
    const [ url, setUrl ] = React.useState();
    const [ postback, setPostback ] = useState();
    const [ colorIcon, setColorIcon ] = useState({
        inactive: "#6c757d",
        active: "#2e3192"
    });
    const [ loading, setLoading ] = React.useState(false);
    const [ isCreate, setIsCreate ] = React.useState(true);
    const [firebase, setFirebase ] = useState(null);

    useEffect(() => {
        if(firebase === null){
            setFirebase(props.firebase);
        }
    },[props])

    useEffect(() => {
         getConfigurations();
         console.log("postback-->",postback);
    },[])

    const getConfigurations = async () => {
        setLoading(true);
        const localMenu = JSON.parse(localStorage.getItem("menu_persistente"));
        let options;
        if(localMenu === null){
            const callback = await obtenerConfiguracionMenuPersistente(firebase, '/api/read/configuracion/persistent-menu');
            localStorage.setItem('menu_persistente',JSON.stringify(callback));
            options = callback.data.persistent_menu[0].call_to_actions;
        } else {
            options = localMenu.data.persistent_menu[0].call_to_actions;
        }
        const settingOptions = options.map((option,index) => {
            const nObj = {...option};
            nObj['order'] = index + 1;
            nObj['option'] = option.type === 'web_url' ? 'url' : 'postback';
            return nObj;
        })
        const settingIconsOptions = settingOptions.map(option => {
            const nObj = {...option};
            nObj['order'] = option.order;
            nObj['selected'] = false;
            return nObj;
        });
        setMenus(prevState => [
            ...settingOptions
        ])
        setIconsOptions(prevState => [
            ...settingIconsOptions
        ])
        setLoading(false);
        return true;
    }

    const handleChange = event => {
      setOption(event.target.value);
    };

    const addLocalOption = e => {
        if(menus.length >= 3){
            openMensajePantalla(dispatch,{
                open: true,
                mensaje: 'Solo puedes tener 3 opciones en el menú persistente.'
            })
            return false;
        }
        if(isCreate){
            if(option === 'url'){
                if(btnTitle === undefined || url === undefined){
                    openMensajePantalla(dispatch,{
                        open: true,
                        mensaje: 'El campo título y url son obligatorios.'
                    })
                    return false;
                }
                setMenus(prevState => [
                    ...prevState,
                  {
                      type: "web_url",
                      title: btnTitle,
                      url: url,
                      webview_height_ratio: "full",
                      order: menus.length + 1, 
                      option: 'url'
                  }
                ])
            }else if(option === 'postback'){
                if(btnTitle === undefined || postback === undefined){
                    openMensajePantalla(dispatch,{
                        open: true,
                        mensaje: 'El campo título y postback son obligatorios.'
                    })
                    return false;
                }
                setMenus(prevState => [
                    ...prevState,
                  {
                      type: "postback",
                      title: btnTitle,
                      payload: postback,
                      order: menus.length + 1, 
                      option: 'postback'
                  }
                ])
            }
            setIconsOptions(prevState => [
                ...prevState,
                {
                    order: menus.length + 1, selected: false 
                }
            ])
            setBtnTitle('');
            setUrl('');
            setPostback('');
        } else {
            const isSelect = iconsOptions.filter(icon => icon.selected === true);
            const selectedMenuOption = menus.filter(menu => menu.order === isSelect[0].order);
            if(option === 'url'){
                const newMenuOptions = menus.map(menu => {
                    if(menu.order === isSelect[0].order){
                        menu.title = btnTitle;
                        menu.url = url;
                    }
                    return menu;
                })
                setMenus(prevState => [
                    ...newMenuOptions
                ]);
            }else if(option === 'postback'){
                if(btnTitle === undefined || postback === undefined){
                    openMensajePantalla(dispatch,{
                        open: true,
                        mensaje: 'El campo título y postback son obligatorios.'
                    })
                    return false;
                } else {
                    setMenus(prevState => [
                        ...prevState,
                      {
                          type: "postback",
                          title: btnTitle,
                          payload: postback
                      }
                    ])
                }
            }
        }
    }

    const deleteLocalOption = e => {
        setIsCreate(true);
        setBtnTitle('');
        setUrl('');
        const optionSelected = iconsOptions.filter(option => option.selected)
        const order = optionSelected[0].order;
        const newIconsOptions = iconsOptions.filter(option => !option.selected);
        const orderNewIconsOptions = newIconsOptions.map((option,index) => {
            const nObj = {...option};
            nObj['order'] = index + 1;
            return nObj;
        })
        const newOptions = menus.filter(menu => menu.order !== order);
        const newOptionsOrder = newOptions.map((menu, index) => {
            const nObj = {...menu};
            nObj['order'] = index + 1;
            return nObj;
        })
        setMenus(prevState => [
            ...newOptionsOrder
        ])
        setIconsOptions(prevState => [
            ...orderNewIconsOptions
        ])
    }

    const selectOptionMenu = event => {
        setLoading(true);
        setBtnTitle("");
        setUrl("");
        setPostback("");
        const key = event.nativeEvent.target.parentNode.parentNode.dataset["key"];
        const newIconsOptions = iconsOptions.map(obj => {
            obj.order == key ? obj.selected = !obj.selected : obj.selected = false;
            return obj;
        })
        setIconsOptions(newIconsOptions);
        const isSelect = iconsOptions.filter(icon => {
            return icon.selected === true
        });
        if(isSelect.length){
            setIsCreate(false);
            const selectedMenuOption = menus.filter(menu => menu.order == key);
            if(selectedMenuOption[0] !== undefined){
                if(selectedMenuOption[0].option === 'url'){
                    setBtnTitle(selectedMenuOption[0].title);
                    setUrl(selectedMenuOption[0].url);
                    console.log("url",url);
                } else {
                    setBtnTitle(selectedMenuOption[0].title);
                    setPostback(selectedMenuOption[0].payload);
                    console.log("payload",selectedMenuOption[0].payload);
                    console.log("postback",postback);
                }
            }
        } else {
            setIsCreate(true);
            setBtnTitle("");
            setUrl("");
        }
        setLoading(false);
    }

    const sendData = async event => {
        setLoading(true);
        if(menus.length){
            const newMenuOptions = menus.map( menu => {
                const nObj = {};
                nObj['type'] = menu.type;
                nObj['title'] = menu.title;
                if(menu.option === 'url'){
                    nObj['url'] = menu.url;
                    nObj['webview_height_ratio'] = menu.webview_height_ratio;
                } else if(menu.option === 'postback'){
                    nObj['payload'] = menu.payload;
                }
                return nObj;
            })
            const data = {
                "persistent_menu": [
                    {
                        "locale": "default",
                        "composer_input_disabled": false,
                        "call_to_actions": [
                            ...newMenuOptions
                        ]
                    }
                ]
            }
            const callback = await establecerMenuPersistente(firebase, '/api/create/configuracion/persistent-menu', data);
            if(callback.status == 200){
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: "Se ha realizado correctamente la actualización."
                })
                localStorage.setItem('menu_persistente',JSON.stringify(data));
            } else {
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: "No se ha podido realizar la actualización."
                })
            }
        }else{
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: "No hay información para enviar."
            })
        }
        setLoading(false);
    }

    return (
        <Container component="main" maxWidth="md">
          <div className="title" style={props.style.title}>
              <Typography component="h1" variant="h5">
                  Menú persistente
              </Typography>
          </div>
          <div className="section">
            <p>
              El menú persistente te permite tener un elemento activo de la interfaz de usuario en todo momomento dentro de las conversaciones de Messenger.
            </p>
            <Card>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                    Opciones
                    </Typography>
                        {
                        iconsOptions.length ?
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                        {iconsOptions.map(value => (
                            <Button data-key={value.order} style={{background: value.selected === true ? colorIcon.active : colorIcon.inactive}} onClick={selectOptionMenu} key={value.order}>
                                <div>
                                    {menus.filter(menu => menu.order === value.order)[0].title}
                                </div>
                            </Button>
                        ))}
                        </ButtonGroup>
                        : <Typography>No hay opciones</Typography>
                        }
                </CardContent>
                {                            
                    loading ? <Grid container justify="center"><CircularProgress /> </Grid>: ''
                }
            </Card>
            <Grid container justify="center" style={{marginTop: '20px'}}>
                <Grid item xs={12} md={6}>
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    style={style.btnSend}
                    onClick={sendData}
                    disabled={loading}
                >
                    <SendIcon/>
                    Enviar a Messenger
                </Button>
                </Grid>
            </Grid>
            <form style={props.style.form}>
                <Grid container spacing={10}>
                <Grid item xs={12} md={12}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                        Añadir nueva opción
                        </Typography>
                        <TextField
                            name="button-title"
                            variant="outlined"
                            fullWidth
                            label="Añadir título del boton"
                            value={btnTitle}
                            onChange={e => setBtnTitle(e.target.value)}
                        />
                        <IconButton aria-label="add" color="secondary" onClick={addLocalOption} 
                            disabled={loading}>
                            <AddCircleIcon color="primary" style={{marginRight: '0', paddingRight: '0'}} />
                        </IconButton>
                        <IconButton aria-label="delete" color="secondary" 
                            disabled={loading} onClick={deleteLocalOption}>
                            <DeleteIcon style={{marginLeft: '0', paddingLeft: '0'}}/>
                        </IconButton>
                        <Grid item xs={12} md={12} style={{marginTop: '15px'}}>
                        <RadioGroup aria-label="options" name="options-menu" value={option} onChange={handleChange}>
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
                                    style={{ width: 300 }}
                                    renderInput={params => <TextField {...params} label="Combo box" variant="outlined" />}
                                    inputValue={postback}
                                    // value={{postback}}
                                    onChange={e => setPostback(e.target.textContent)}
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
                                name="url"
                                variant="outlined"
                                fullWidth 
                                label="Añadir URL"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                />
                            </Container>
                            : ''}
                        </RadioGroup>
                        </Grid>
                    </CardContent>
                    <CardActions>                        
                    </CardActions>
                </Card>
                </Grid>
                </Grid>
            </form>
          </div>
        </Container>
    );
};

const formatPostbacks = () => {
    const internalPostbacks = JSON.parse(localStorage.getItem('postbacks'));
    const formatPostbacks = [];
    internalPostbacks.forEach(element => {
        formatPostbacks.push({title: Object.keys(element)[0]});
    });
    return formatPostbacks;
}
export default compose(consumerFirebase, withRouter)(MenuPersistente);