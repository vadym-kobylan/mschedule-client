import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
//nested data is ok, see accessorKeys in ColumnDef below
// import { data } from '../constants';
import axios from 'axios';
import NotFound from '../pages/NotFound';

const AdminTable = () => {
  const navigateTo = useNavigate();

  const [data, setData] = useState([]);
  const [role, setRole] = useState([]);

  useEffect(() => {
    setRole(localStorage.getItem('role') || '');

    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Adjust content type as needed
    };

    axios
      .get(`http://localhost:8080/api/v1/staff`, { headers })
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        size: 50,
      },
      {
        accessorKey: 'firstname',
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'lastname',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'taskNums', //normal accessorKey
        header: 'Tasks',
        size: 50,
      },
      {
        accessorKey: 'isFree',
        header: 'Status',
        size: 50,
        Cell: (value) => (value.renderedCellValue ? 'Free 🟢' : 'Busy 🔴'),
      },
    ],

    [],
  );
  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)

    muiTableBodyCellProps: ({ row }) => ({
      onClick: (event) => {
        console.info(row.original.id);
        navigateTo(`/users-table/${row.original.id}`);
      },
      sx: {
        cursor: 'pointer', //you might want to change the cursor too when adding an onClick
      },
    }),
  });

  // Render table only if staff data is available
  return <MaterialReactTable table={table} />;
};

export default AdminTable;
