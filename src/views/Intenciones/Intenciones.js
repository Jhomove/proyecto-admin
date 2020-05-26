import React, { useContext } from 'react';
import { TextField, Button, TableContainer, makeStyles, Table, TableHead, TableRow, TableCell } from '@material-ui/core';
import { StateContextPostbacks } from '../../postbacks/store';
import { v4 as uuidv4 } from 'uuid';

const styles = {
    containerGeneral: {
        width: '100%',
        padding: '25px 50px 50px'
    }
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        width: '100%',
        maxHeight: 440
    }
})

const dataDePrueba = [
    { id: '1', label: 'Id', minWidth: 50},
    { id: '2', label: 'Intención', minWidth: 200}
]

const Intenciones = props => {
    const classes = useStyles();

    return(<div style={styles.containerGeneral}>
        <div>
            <Button variant="contained" color="primary" onClick={()=> props.history.push('/intenciones/crear')}>
                + Nueva intención
            </Button>
        </div>
        <TextField
            autoFocus
            margin="normal"
            id="search-intents"
            name="search-intents"
            label="Buscar intenciones"
            type="text"
            fullWidth
            variant="outlined"
        />
        <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        {
                            dataDePrueba.map(element => (
                                <TableCell
                                    key={uuidv4()}
                                >
                                    {element.label}
                                </TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    </div>);
}

export default Intenciones;