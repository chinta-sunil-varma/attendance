import React from 'react'
import { Box} from '@mui/system'
import { DataGrid } from '@mui/x-data-grid';

export const DataTable = (props) => {
    const columns = [{ field: "id", headerName: "id" },
    { field: "ID", headerName: "ID", width: 170 },
    { field: "NAME", headerName: "NAME", width: "500" },
    { field: "STATUS", headerName: "STATUS", width: "500" },
    
    ]
  return (
    <Box sx={{ height: '350%', width: "60%",color:'red',marginLeft:'auto',marginRight:'auto' }}>
            <DataGrid
              rows={data}
              columns={columns}
              
              pageSize={5}
              rowsPerPageOptions={[5]}
              
              
             
            

            />
          </Box>
  )
}
