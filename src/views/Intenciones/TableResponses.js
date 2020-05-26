import React, { useContext, useState, useEffect } from 'react';
import { StateContextPostbacks } from '../../postbacks/store';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
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

const default_data = [];

const TableResponses = props => {
    const { postbacks } = useContext(StateContextPostbacks);
    const [ responsePostbacks, setResponsePostbacks ] = useState(default_data);

    const handleSearchKeyDown = e => {
        const { value } = e.target;
        const match_postback = postbacks.find(postback => postback.title === value);
        const match_response = responsePostbacks.find(response => response.ident === value);
        if(e.key === 'Enter' && match_postback !== undefined && match_response === undefined){
            // e.target.value = ""
            // Solucionar limpiar input
            setResponsePostbacks(prevState => [
                ...prevState,
                {
                    ident: value
                }
            ]);
        }
    }

    const handleDeleteElement = key => e => {
        const updated_response = responsePostbacks.slice(0);
        updated_response.splice(key,1);
        setResponsePostbacks(updated_response)
        updatedIntents(updated_response);
    }

    const handleSaveReponses = event => {
        updatedIntents(responsePostbacks);
    }

    const updatedIntents = responsePostbacks => {
        props.setIntent(prevState => ({
            ...prevState,
            responses: responsePostbacks
        }));
    }

    return (
        <div style={{marginTop: 10}}>
            <Autocomplete
                id="combo-box-demo"
                options={postbacks}
                getOptionLabel={option => option.key}
                renderInput={params => <TextField {...params} label="Seleccionar el postback" variant="outlined" fullWidth/>}
                // inputValue={postback}
                // value={{postback}}
                onKeyDown={handleSearchKeyDown}
                onBlur={handleSaveReponses}
                // onChange={e => )}
            />
            <TableContainer style={{marginTop: 10}}>
                <Table>
                    <TableBody>
                        {
                            !responsePostbacks.length ? (
                                <TableRow>
                                    <StyledTableCellDefault>
                                        Respuesta para el usuario una vez identificada la intención
                                    </StyledTableCellDefault>
                                </TableRow>
                            ) :
                            (
                                responsePostbacks.map((postback,key) => {
                                    console.log("postback",postback);
                                    return (
                                    <TableRow key={uuidv4()}>
                                        <StyledTableCell>
                                            {postback.ident}
                                            <div style={{marginLeft: 'auto'}}>
                                                <DeleteOutlineIcon color="secondary" onClick={handleDeleteElement(key)}/>
                                            </div>
                                        </StyledTableCell>
                                    </TableRow>
                                )})
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default TableResponses;