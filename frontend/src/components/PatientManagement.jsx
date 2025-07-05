// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableRow, 
//   Button, 
//   Modal, 
//   TextField, 
//   Select, 
//   MenuItem,
//   InputLabel,
//   FormControl,
//   IconButton
// } from '@mui/material';
// import { Search, Close } from '@mui/icons-material';

// const PatientManagement = () => {
//   const [patients, setPatients] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     email: '',
//     phone: '',
//     condition: '',
//     status: 'active'
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');

//   useEffect(() => {
//     // Mock data initially; replace with API call
//     const fetchPatients = async () => {
//       const response = await fetch('http://localhost:5000/api/patients');
//       const data = await response.json();
//       setPatients(data.patients || []);
//     };
//     fetchPatients();
//   }, []);

//   const handleOpen = () => {
//     setFormData({ name: '', age: '', email: '', phone: '', condition: '', status: 'active' });
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const response = await fetch('http://localhost:5000/api/patients', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     });
//     if (response.ok) {
//       const newPatient = await response.json();
//       setPatients([...patients, newPatient]);
//       handleClose();
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSearchChange = (e) => setSearchTerm(e.target.value);
//   const handleFilterChange = (e) => setStatusFilter(e.target.value);

//   const filteredPatients = patients.filter(patient =>
//     patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//     (statusFilter ? patient.status === statusFilter : true)
//   );

//   return (
//     <Box sx={{ mt: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <TextField
//             variant="outlined"
//             size="small"
//             placeholder="Search patients..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             InputProps={{ startAdornment: <Search /> }}
//           />
//           <FormControl variant="outlined" size="small">
//             <InputLabel>Status</InputLabel>
//             <Select value={statusFilter} onChange={handleFilterChange} label="Status">
//               <MenuItem value="">All</MenuItem>
//               <MenuItem value="active">Active</MenuItem>
//               <MenuItem value="inactive">Inactive</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//         <Button variant="contained" onClick={handleOpen}>
//           Add Patient
//         </Button>
//       </Box>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>ID</TableCell>
//             <TableCell>Name</TableCell>
//             <TableCell>Age</TableCell>
//             <TableCell>Email</TableCell>
//             <TableCell>Phone</TableCell>
//             <TableCell>Condition</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {filteredPatients.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={8} align="center">No patients found</TableCell>
//             </TableRow>
//           ) : (
//             filteredPatients.map(patient => (
//               <TableRow key={patient.id}>
//                 <TableCell>{patient.id}</TableCell>
//                 <TableCell>{patient.name}</TableCell>
//                 <TableCell>{patient.age}</TableCell>
//                 <TableCell>{patient.email}</TableCell>
//                 <TableCell>{patient.phone}</TableCell>
//                 <TableCell>{patient.condition}</TableCell>
//                 <TableCell>{patient.status}</TableCell>
//                 <TableCell>
//                   <Button variant="outlined" size="small">Edit</Button>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//       <Modal open={open} onClose={handleClose}>
//         <Box sx={{ p: 3, bgcolor: 'white', m: 'auto', mt: '10%', width: 400 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//             <Typography variant="h6">Add Patient</Typography>
//             <IconButton onClick={handleClose}><Close /></IconButton>
//           </Box>
//           <form onSubmit={handleSubmit}>
//             <TextField fullWidth margin="dense" label="Name" name="name" value={formData.name} onChange={handleInputChange} />
//             <TextField fullWidth margin="dense" label="Age" name="age" type="number" value={formData.age} onChange={handleInputChange} />
//             <TextField fullWidth margin="dense" label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
//             <TextField fullWidth margin="dense" label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
//             <TextField fullWidth margin="dense" label="Condition" name="condition" value={formData.condition} onChange={handleInputChange} />
//             <FormControl fullWidth margin="dense">
//               <InputLabel>Status</InputLabel>
//               <Select name="status" value={formData.status} onChange={handleInputChange}>
//                 <MenuItem value="active">Active</MenuItem>
//                 <MenuItem value="inactive">Inactive</MenuItem>
//               </Select>
//             </FormControl>
//             <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save</Button>
//           </form>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default PatientManagement;
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Button, 
  Modal, 
  TextField, 
  Select, 
  MenuItem,
  InputLabel,
  FormControl,
  IconButton
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import axios from 'axios';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    condition: '',
    status: 'active'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patients', {
          params: { search: searchTerm, status: statusFilter, page: 1, limit: 10 }
        });
        setPatients(response.data.patients || response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, [searchTerm, statusFilter]);

  const handleOpen = () => {
    setFormData({ name: '', age: '', email: '', phone: '', condition: '', status: 'active' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/patients', formData);
      setPatients([...patients, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setStatusFilter(e.target.value);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter ? patient.status === statusFilter : true)
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{ startAdornment: <Search /> }}
          />
          <FormControl variant="outlined" size="small">
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={handleFilterChange} label="Status">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" onClick={handleOpen}>
          Add Patient
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPatients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">No patients found</TableCell>
            </TableRow>
          ) : (
            filteredPatients.map(patient => (
              <TableRow key={patient._id}>
                <TableCell>{patient._id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell>{patient.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 3, bgcolor: 'white', m: 'auto', mt: '10%', width: 400 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Add Patient</Typography>
            <IconButton onClick={handleClose}><Close /></IconButton>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth margin="dense" label="Name" name="name" value={formData.name} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" label="Age" name="age" type="number" value={formData.age} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" label="Condition" name="condition" value={formData.condition} onChange={handleInputChange} />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select name="status" value={formData.status} onChange={handleInputChange}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save</Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default PatientManagement;