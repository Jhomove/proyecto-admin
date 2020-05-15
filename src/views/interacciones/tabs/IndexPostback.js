import React, { Component, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { StateContextPostbacks } from '../../../postbacks/store';
import { establecerPostbacks, actualizarPostback, obtenerPostbacks } from '../../../actions/interactionsAction';
import { consumerFirebase } from '../../../server';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import OptionsPostbacks from './OptionsPostbacks';
import { IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Edit from '../../../components/modal/postbacks/Edit';
import Delete from '../../../components/modal/postbacks/Delete';
import Create from '../../../components/modal/postbacks/Create';
// import swal from 'sweetalert';
// import Modal from '../../../components/modal/Modal';

const styles = {
    table: {
        fontFamily: "Trebuchet MS, Arial, Helvetica, sans-serif",
        borderCollapse: 'collapse',
        width: '100%'
    },
    td: {
        border: '1px solid #ddd',
        padding: '8px'
    },
    th: {
        border: '1px solid #ddd',
        padding: '8px',
        paddingTop: '12px',
        paddingBottom: '12px',
        textAlign: 'left',
        backgroundColor: '#253b80',
        color: 'white'
    }
}

const IndexPostback = (props) => {
    const { postbacks,dispatchPostbacks } = useContext(StateContextPostbacks);
    const [ dataPostbakcs, setDataPostbacks ] = useState({});
    const [ openDashboard, setOpenDashboard ] = useState(true);
    const [ trs, setTrs ] = useState([]);//Contiene cada postback para renderizar en la tabla
    const [ openEdit, setOpenEdit] = useState(false);
    const [ openCreate, setOpenCreate ] = useState(false);
    const [ openDelete, setOpenDelete ] = useState(false);
    const [ firebase, setFirebase ] = useState();
    //Height de las dos barras superiores 
    //Barra superior + Barra sgte
    const Height = 64 + 48;

    const handleClickOpen =  args => event => {
        const element= event.currentTarget;
        const type = element.dataset['type'];
        switch (type) {
            case 'create':
                setOpenCreate(true);
                break;
            case 'edit':
                setDataPostbacks({
                    title: args.title,
                    description: args.description,
                    key: args.key,
                    content: args.content
                })
                setOpenEdit(true);
                break;
            case 'delete':
                setDataPostbacks({
                    title: args.title,
                    description: args.description,
                    key: args.key,
                    content: args.content
                })
                setOpenDelete(true);
                break;
            case 'list':
                console.log("args!!!!!!",args)
                setDataPostbacks({
                    title: args.title,
                    description: args.description,
                    key: args.key,
                    content: args.content
                })
                setOpenDashboard(false);
                break;
            default:
                break;
        }
    };

    const handleClose = event => {
        const element = event.currentTarget;
        const type = element.dataset['type'];
        console.log("type",type)
        switch (type) {
            case 'create':
                setOpenCreate(false);
                break;
            case 'edit':
                setOpenEdit(false);
                break;
            case 'delete':
                setOpenDelete(false);
                break;
            case 'list':
                setOpenDashboard(true);
                break;
            default:
                break;
        }
        // setOpen(false);
    };

    useEffect(() => {
        getInteractions();
    }, [postbacks])

    const getInteractions = async() => {
        let local_postbacks = typeof postbacks === 'string' ? JSON.parse(postbacks) : postbacks;
        const storage_postback = [];
        let is_local = false;
        if(local_postbacks.length){
            setTrs(prevState => storage_postback)
            is_local = true;
        } else {
            const callback = await obtenerPostbacks(firebase, 'api/read/postbacks');
            local_postbacks = callback['data'];
            is_local = false;
        }
        local_postbacks.forEach(postback => {
            if(!is_local){
                dispatchPostbacks({type: 'ADD_POSTBACKS', data: postback})
            }
            setTrs(prevState => [
                ...prevState,
                postback
            ]);
        });
        // local_postbacks.forEach(element => {
        //     const namePostback = Object.keys(element)[0];
        //     const match = postbacks.filter(postback => postback.title === namePostback);
        //     if(!match.length){
        //         // setPostbacks(prevState => [
        //         //     ...prevState,
        //         //     { title: namePostback }
        //         // ])
        //         // dispatchPostbacks({type: 'ADD_POSTBACKS', data: element})
        //     }
        // });
    }

    useEffect(() => {
        if(props.firebase !== firebase)
              setFirebase(props.firebase);
    }, [props])
    
    return openDashboard ? (
        <div style={{width: '100%', margin: '20px'}}>
            <IconButton aria-label="add" color="primary" size="medium" data-type="create" onClick={handleClickOpen()}>
                <Tooltip title="Nuevo postback">
                    <AddIcon />
                </Tooltip>
            </IconButton>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Título</th>
                        <th style={styles.th}>Descripción</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {trs.map(tr => (
                        <tr className="parent-tr" id={tr.key} key={tr.key}>
                            <td style={styles.td}>{tr.title}</td>
                            <td style={styles.td}>{tr.description}</td>
                            <td style={styles.td}>
                                <Tooltip title="Editar">
                                    <IconButton aria-label="edit" color="primary" data-type="edit" onClick={handleClickOpen({key: tr.key, description: tr.description, title: tr.title, content: tr.content })}>
                                        <CreateIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Lista de opciones">
                                    <IconButton aria-label="options" color="primary" data-type="list" onClick={handleClickOpen({key: tr.key, description: tr.description, title: tr.title, content: tr.content })}>
                                        <ListIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Borrar">
                                    <IconButton aria-label="delet" color="secondary" data-type="delete" onClick={handleClickOpen({key: tr.key, title: tr.title})}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Edit open={openEdit} handleClose={handleClose} data={dataPostbakcs} firebase={firebase}/>
            <Create open={openCreate} handleClose={handleClose} firebase={firebase}/>
            <Delete open={openDelete} handleClose={handleClose} firebase={firebase} data={dataPostbakcs} setOpenDelete={setOpenDelete}/>
        </div>
        
    ) : <OptionsPostbacks height={Height} firebase={firebase} data={dataPostbakcs} handleClose={handleClose}/>
    ;
}

export default compose(consumerFirebase, withRouter)(IndexPostback);