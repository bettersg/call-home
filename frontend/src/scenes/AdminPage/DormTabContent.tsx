import React, { useEffect, useState, FormEvent } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import { useAdminService } from 'contexts';
import { DormResponse } from '@call-home/shared/types/Dorm';

function NewDormForm() {
  const [, adminService] = useAdminService();

  const [dormName, setDormName] = useState('');

  const handleDormNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDormName(event.target.value);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return adminService?.createDorm({ name: dormName });
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
  const [, adminService] = useAdminService();
  const [dormName, setDormName] = useState(dorm.name);

  const updateDormName = async () => {
    await adminService?.updateDorm(dorm.id, {
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
  const [adminState, adminService] = useAdminService();
  const { dorms = [] } = adminState || {};
  const [rowIdToEdit, setDormIdToEdit] = useState<number | string | null>(null);

  useEffect(() => {
    if (adminService) {
      adminService.refreshDorms();
    }
  }, [adminService]);

  return (
    <>
      <Typography variant="h5" component="h2" style={{ margin: '8px' }}>
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
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    role="button"
                    style={{ color: 'red' }}
                    onClick={() => {
                      adminService?.deleteDorm(Number(dorm.id));
                    }}
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
