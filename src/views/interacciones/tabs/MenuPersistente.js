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
    const [ btnTitle, setBtnTitle ] = useState();
    const [ option, setOption ] = React.useState('bloque');
    const [ url, setUrl ] = React.useState();
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
    },[])

    const getConfigurations = async () => {
        setLoading(true);
        const callback = await obtenerConfiguracionMenuPersistente(firebase, '/api/read/configuracion/persistent-menu');
        const options = callback.data.persistent_menu[0].call_to_actions;
        const settingOptions = options.map((option,index) => {
            const nObj = {...option};
            nObj['order'] = index + 1;
            nObj['option'] = option.type === 'web_url' ? 'url' : 'bloque';
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
                setIconsOptions(prevState => [
                    ...prevState,
                    {
                        order: menus.length + 1, selected: false 
                    }
                ])
            }else if(option === 'bloque'){
                // if(btnTitle === undefined || url === undefined){
                    openMensajePantalla(dispatch,{
                        open: true,
                        mensaje: 'Función no hábilitada.'
                    })
                    return false;
                // }
            }
            setBtnTitle('');
            setUrl('');
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
            if(selectedMenuOption[0] !== undefined && selectedMenuOption[0].option === 'url'){
                setBtnTitle(selectedMenuOption[0].title);
                setUrl(selectedMenuOption[0].url);
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
                if(menu.option === 'url'){
                    nObj['type'] = menu.type;
                    nObj['title'] = menu.title;
                    nObj['url'] = menu.url;
                    nObj['webview_height_ratio'] = menu.webview_height_ratio;
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
            console.log("callback", callback);
            if(callback.status == 200){
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: "Se ha realizado correctamente la actualización."
                })
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
                            <FormControlLabel value="bloque" control={<Radio />} label="Bloque" />
                            {option === 'bloque' ?
                            <Container>
                                <Typography>
                                    1. Redireccionar al bloque:
                                </Typography>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={top100Films}
                                    getOptionLabel={option => option.title}
                                    style={{ width: 300 }}
                                    renderInput={params => <TextField {...params} label="Combo box" variant="outlined" />}
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

const top100Films =
[
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
]
export default compose(consumerFirebase, withRouter)(MenuPersistente);