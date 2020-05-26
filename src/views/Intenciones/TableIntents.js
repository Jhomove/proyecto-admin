import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { v4 as uuidv4 } from 'uuid';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const StyledTableCellDefault = withStyles((theme) => ({
    body: {
      background: '#E5E5E5',
      fontSize: 16
    },
  }))(TableCell);

const StyledTableCell = withStyles((theme) => ({
    body: {
      border: '1px solid #E5E5E5',
      fontSize: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center'
    },
  }))(TableCell);

  const styles = {
    containerUsersSays: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center'
    },
    usersSaysInput: {
        flex: 8
    },
    usersSaysSearch: {
        flex: 4,
        paddingLeft: 5
    }
}

const default_data = [];

const TableIntents = props => {

    const [ says, setUserSays ]  = useState(default_data);

    const handleKeyDowm = e => {
        const { value } = e.target;
        if(e.key === 'Enter'){
            setUserSays(prevState => [
                ...prevState,
                {
                    'text': value
                }
            ])
            e.target.value = "";
        }
    }

    const handleDeleteElement = key => e => {
        const updated_says = says.slice(0);
        updated_says.splice(key,1);
        setUserSays(updated_says)
        updatedIntents(updated_says);
    }

    const handleSaveSays = event => updatedIntents(says);

    const updatedIntents = says => {
        props.setIntent(prevState => ({
            ...prevState,
            says: says
        }));
    }

    return (
        <div style={{marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #C4C4C4'}}>
            <div style={styles.containerUsersSays}>
                <div style={styles.usersSaysInput}>
                    <TextField
                        margin="normal"
                        id="users-says"
                        name="users-says"
                        label="El usuario dice"
                        type="text"
                        fullWidth
                        variant="outlined"
                        onKeyDown={handleKeyDowm}
                        onBlur={handleSaveSays}
                    />
                </div>
                <div style={styles.usersSaysSearch}>
                    <TextField
                        margin="normal"
                        id="search-users-says"
                        name="search-users-says"
                        label="Buscar"
                        type="text"
                        variant="outlined"
                        fullWidth
                    />
                </div>
            </div>
            <TableContainer>
                <Table>
                    <TableBody>
                        {
                            !says.length ? (
                                <TableRow>
                                    <StyledTableCellDefault>Ejemplo: ¿Como está el clima hoy?</StyledTableCellDefault>
                                </TableRow>
                            ) :
                            says.map((intent,key) => (
                                <TableRow key={uuidv4()}>
                                    <StyledTableCell>{intent.text}
                                        <div style={{marginLeft: 'auto'}}>
                                            <DeleteOutlineIcon color="secondary" onClick={handleDeleteElement(key)}/>
                                        </div>
                                    </StyledTableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default TableIntents;