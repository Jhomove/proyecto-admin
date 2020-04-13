import React, { Component } from 'react';
import { Card,CardActionArea, CardMedia, CardContent, TextField, Grid, CardActions, IconButton, Modal } from '@material-ui/core';
import ImageUploader from "react-images-upload";
import DeleteIcon from '@material-ui/icons/Delete';
import HeightIcon from '@material-ui/icons/Height';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from '@material-ui/core/styles';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}
  
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
  
const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const PlantillaGenerica = (props) => {

    const subirFoto = fotos => {
        //1. Capturar la imagen
        const foto = fotos[0];
        //2. Renombrar la imagen
        const claveUnicaFoto = uuidv4();
        //3. Obtener el nombre de la foto
        const nombreFoto = foto.name;
        //4. Obtener la extensión de la imagen
        const extensionFoto = nombreFoto.split(".").pop();
        //5. Crear el nuevo nombre de la foto
        const alias = (
          nombreFoto.split(".")[0] +
          "_" +
          claveUnicaFoto +
          "." +
          extensionFoto
        )
          .replace(/\s/g, "_")
          .toLowerCase();
    
        // firebase.guardarDocumento(alias, foto).then(metadata => {
        //   firebase.devolverDocumento(alias).then(urlFoto => {
        //     estado.foto = urlFoto;
    
        //     firebase.db
        //       .collection("Users")
        //       .doc(firebase.auth.currentUser.uid)
        //       .set(
        //         {
        //           foto: urlFoto
        //         },
        //         { merge: true }
        //       )
        //       .then(userDB => {
        //         dispatch({
        //           type: "INICIAR_SESION",
        //           sesion: estado,
        //           autenticado: true
        //         });
        //       });
        //   });
        // });
      };
    
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpenModal = () => {
        setOpen(true);
    };
    
    const handleCloseModal = () => {
        setOpen(false);
    };


    const body = (
    <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Text in a modal</h2>
        <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p>
        <PlantillaGenerica />
    </div>
    );

    let fotoKey = uuidv4();

        return (
            <div key={props.key}>
                <Grid container direction="row" alignItems="center" justify="center" spacing={0}>
                    <Grid item xs={10} md={10} justify="center">
                        <Card>
                            <CardActionArea>
                                <CardMedia
                                    data-type={props.type}
                                    onChange={props.handleChange}
                                    data-prop='image_url'
                                    className="parent"
                                    data-id={props.id}
                                >
                                        <ImageUploader
                                            withIcon={true}
                                            key={fotoKey}
                                            singleImage={true}
                                            buttonTExt="Upload Image"
                                            onChange={subirFoto}
                                            imgExtension={[".jpg",".gif",".png",".jpeg"]}
                                            maxFileSize={5242880}
                                            //buscar propiedad value
                                        />
                                </CardMedia>
                                <CardContent>
                                    <TextField
                                        name={props.name + "-default_action"}
                                        fullWidth
                                        data-id={props.id}
                                        data-type={props.type}
                                        data-prop="default_action"
                                        variant="outlined"
                                        label="Añadir url externa"
                                        className= "text element parent"
                                        value={props.default_action.url !== undefined ? props.default_action.url : ""}
                                        onChange={props.handleChange}
                                        style={{marginTop: 10}}
                                    />
                                    <TextField
                                        name={props.name + "-title"}
                                        fullWidth
                                        data-id={props.id}
                                        data-type={props.type}
                                        data-prop='title'
                                        variant="outlined"
                                        label="Añadir título"
                                        className= "text element parent"
                                        value={props.title}
                                        onChange={props.handleChange}
                                        style={{marginTop: 10}}
                                        />
                                    <TextField
                                        name={props.name + "-subtitle"}
                                        fullWidth
                                        data-id={props.id}
                                        data-type={props.type}
                                        data-prop="subtitle"
                                        variant="outlined"
                                        label="Añadir subtítulo"
                                        className= "text element parent"
                                        value={props.subtitle}
                                        onChange={props.handleChange}
                                        style={{marginTop: 10}}
                                    />
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <IconButton aria-label color="primary" disabled={props.loading} onClick={handleOpenModal}>
                                    <LocalHospitalIcon style={{marginLeft: '0', paddingLeft: '0'}}/>
                                </IconButton>
                                <Modal
                                    open={open}
                                    onClose={handleCloseModal}
                                    aria-labelledby="simple-modal-title"
                                    aria-describedby="simple-modal-description"
                                >
                                    {body}
                                </Modal>
                                <IconButton aria-label="move" color="primary" disabled={props.loading}>
                                    <HeightIcon style={{marginLeft: '0', paddingLeft: '0'}}/>
                                </IconButton>
                                <IconButton aria-label="delete" color="secondary"
                                    disabled={props.loading}>
                                    <DeleteIcon style={{marginLeft: '0', paddingLeft: '0'}} onClick={props.handleDeleteBottomOption}/>
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid> 
                </Grid>
            </div>
            // <div key={idx}>
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
        );
}

export default PlantillaGenerica;