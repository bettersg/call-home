import { useState } from 'react';

import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import { searchCategories } from '../../utils/SearchCategories';
import './SearchBar.css';

// define the interface for the search bar props
interface SearchBarProps {
  searchFunction: (searchString: string[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightBold,
  };
}

export function SearchBar({searchFunction}: SearchBarProps) {
  const theme = useTheme();
  const [categories, setCategories] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof categories>) => {
    const {
      target: { value },
    } = event;
    setCategories(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl sx={{ marginBottom: 2 }} fullWidth>
      <InputLabel id="multiple-chip-label">Which services do you need?</InputLabel>
      <Select
        labelId="mutliple-chip-label"
        multiple
        value={categories}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Which services do you need?" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
        onClose={(event) => {
          event.preventDefault();
          searchFunction(categories);
        }}
      >
        {(Object.keys(searchCategories) as (keyof typeof searchCategories)[]).map((category) => (
          <MenuItem
            key={searchCategories[category]}
            value={searchCategories[category]}
            style={getStyles(searchCategories[category], categories, theme)}
          >
            {searchCategories[category]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
