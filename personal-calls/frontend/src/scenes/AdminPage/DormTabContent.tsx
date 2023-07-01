import React, { useEffect, useState, FormEvent } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useDormService } from 'contexts';
import { DormResponse } from '@call-home/shared/types/Dorm';

function NewDormForm() {
  const [, dormService] = useDormService();

  const [dormName, setDormName] = useState('');

  const handleDormNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDormName(event.target.value);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return dormService?.createDorm({ name: dormName });
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        variant="outlined"
        style={{
          background: 'white',
        }}
        label="Dorm name"
        value={dormName}
        onChange={handleDormNameChange}
      />
      <Button
        type="submit"
        value="submit"
        variant="contained"
        color="primary"
        size="small"
      >
        Add dorm
      </Button>
    </form>
  );
}

function DormNameCellContent({
  isEdit,
  dorm,
}: {
  isEdit: boolean;
  dorm: DormResponse;
}) {
  const [, dormService] = useDormService();
  const [dormName, setDormName] = useState(dorm.name);

  const updateDormName = async () => {
    await dormService?.updateDorm(dorm.id, {
      name: dormName,
    });
  };

  useEffect(() => {
    if (!isEdit && dormName !== dorm.name) {
      updateDormName();
    }
  }, [isEdit]);

  if (isEdit) {
    return (
      <TextField
        value={dormName}
        onChange={(event) => setDormName(event.target.value)}
      />
    );
  }
  return <Typography>{dorm.name}</Typography>;
}

// This uses plain tables instead of DataGrid because DataGrid's rigid Row/Column approach makes it difficult to dynamically change cell contents.
export default function DormTabContent() {
  const [dormState, dormService] = useDormService();
  const { dorms = [] } = dormState || {};
  const [rowIdToEdit, setDormIdToEdit] = useState<number | string | null>(null);

  useEffect(() => {
    if (dormService) {
      dormService.refreshDorms();
    }
  }, [dormService]);

  return (
    <>
      <Typography component="h2" style={{ margin: '8px' }}>
        Dorms
      </Typography>
      <NewDormForm />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dorms.map((dorm) => (
              <TableRow key={dorm.id}>
                <TableCell>
                  <DormNameCellContent
                    isEdit={rowIdToEdit === dorm.id}
                    dorm={dorm}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    role="button"
                    onClick={() => {
                      if (rowIdToEdit === dorm.id) {
                        setDormIdToEdit(null);
                      } else {
                        setDormIdToEdit(dorm.id);
                      }
                    }}
                    size="large"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    role="button"
                    style={{ color: 'red' }}
                    onClick={() => {
                      dormService?.deleteDorm(Number(dorm.id));
                    }}
                    size="large"
                  >
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
