import {
  PrimaryButton,
  NeutralButton,
  ErrorButton,
} from '../common/components/RoundedButton';
import { Container } from '../common/components';

export function Scratch() {
  return (
    <Container
      style={{
        background: 'no-repeat url(/images/background.svg) bottom center',
        backgroundSize: 'contain',
      }}
    >
      <PrimaryButton>Primary</PrimaryButton>
      <NeutralButton>Neutral</NeutralButton>
      <ErrorButton>Error</ErrorButton>
    </Container>
  );
}
