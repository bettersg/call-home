import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import './SearchBar.css';

export function SearchBar() {
  return (
    <form>
      <TextField
        id="search-bar"
        className="text"
        label="What service do you need?"
        variant="outlined"
        placeholder="Search a service..."
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          style: {
            borderRadius: "15px"
          }
        }}
        fullWidth
        sx={{
          display: 'flex',
          marginBottom: '16px'
        }}
      />
    </form>  
  )
}
