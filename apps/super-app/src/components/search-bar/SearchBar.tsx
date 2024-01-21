import { useState } from 'react';

import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import './SearchBar.css';

// define the interface for the search bar props
interface SearchBarProps {
  searchFunction: (searchString: string) => void;
}

export function SearchBar({searchFunction}: SearchBarProps) {
  const [searchText, setSearchText] = useState<string>('');
  return (
    <form>
      <TextField
        id="search-bar"
        className="text"
        label="What service do you need?"
        variant="outlined"
        placeholder="Search a service..."
        size="small"
        onChange={(event) => setSearchText(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="search" onClick={(event) => {
                event.preventDefault();
                searchFunction(searchText);
              }}>
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
