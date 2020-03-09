import React from 'react';
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import {Link} from 'react-router-dom';

export const MenuIzquierda = ({classes}) => (
    <div className={classes.list}>
        <List>
            <ListItem component={Link} button to="/auth/perfil">
                <i className="material-icons">account_box</i>
                <ListItemText classes={{primary: classes.ListItemText}} primary="Perfil" />
            </ListItem>
            <Divider />
            <List>
                <ListItem component={Link} button to="">
                    <i className="material-icons">assessment</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Estadísticas" />
                </ListItem>
                <ListItem component={Link} button to="">
                    <i className="material-icons">record_voice_over</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Interacciones" />
                </ListItem>
                <ListItem component={Link} button to="">
                    <i className="material-icons">comment</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Conocimiento" />
                </ListItem>
                <ListItem component={Link} button to="">
                    <i className="material-icons">drafts</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Dependencias" />
                </ListItem>
                <ListItem component={Link} button to="">
                    <i className="material-icons">supervised_user_circle</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Usuarios" />
                </ListItem>
                <ListItem component={Link} button to="">
                    <i className="material-icons">settings</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Configuración" />
                </ListItem>
            </List>
        </List>
    </div>
)