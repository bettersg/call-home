import React from 'react';
import { IMaskInput } from 'react-imask';

function makeMask({ callingCode, blocks, mask }) {
  return function PhoneNumberMask({ inputRef, onChange, value, ...rest }) {
    const maskValue = value.replace(callingCode, '');
    return (
      <IMaskInput
        blocks={blocks}
        mask={mask}
        {...rest}
        value={maskValue}
        onAccept={(v) => onChange({ target: { value: v } })}
        unmask
        inputRef={inputRef}
        overwrite
        lazy={false}
        autofix
      />
    );
  };
}
const masks = {
  SG: makeMask({
    callingCode: '+65',
    mask: '+65 NNNN NNNN',
    blocks: {
      NNNN: { mask: '0000' },
    },
  }),
  // TODO test BD
  BD: makeMask({
    callingCode: '+880',
    mask: '+88\\0 NNNNN NNNNNN',
    blocks: {
      NNNNN: { mask: '00000' },
      NNNNNN: { mask: '000000' },
    },
  }),
};

export default masks;
