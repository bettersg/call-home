import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import PATHS from './paths';
import Container from '../components/shared/Container';
import { PrimaryButton } from '../components/shared/RoundedButton';

const pageContent = [
  {
    imageUrl: '/images/walkthrough/page_1.svg',
    title: 'Talktime limits starting soon',
    body:
      'Thanks for being an early user of Call Home! We’re limiting call time so more brothers like yourself can use the app.',
  },
  {
    imageUrl: '/images/walkthrough/page_2.svg',
    title: '100 min per week of talktime',
    body:
      'Each week, you can call up to 100 min. Next week, we’ll automatically top up another 100. No need IDD cards!',
  },
  {
    imageUrl: '/images/walkthrough/page_3.svg',
    title: 'Rollover your extra minutes',
    body:
      'If you have extra minutes at the end of the week, you can use them in the next week. No wasted minutes!',
  },
  {
    imageUrl: '/images/walkthrough/page_4.svg',
    title: 'Check your remaining talktime',
    body:
      'You can see how much time left and when the next top up will happen, right below your list of contacts.',
  },
];

export default function CallLimitOnboardPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const { title, body } = pageContent[pageIndex];
  const history = useHistory();
  const isLastPage = pageIndex >= pageContent.length - 1;
  return (
    <Container style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '-20%',
        }}
      >
        {pageContent.map(({ imageUrl }, index) => (
          <img
            key={imageUrl}
            src={imageUrl}
            alt=""
            style={{
              display: index === pageIndex ? null : 'none',
              width: 'auto',
              height: 'auto',
              maxHeight: '240px',
            }}
          />
        ))}
        <Typography
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 600,
          }}
          variant="h5"
          component="h2"
        >
          {title}
        </Typography>
        <Typography
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
          variant="body1"
        >
          {body}
        </Typography>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          width: '200px',
        }}
      >
        <PrimaryButton
          tabIndex="0"
          style={{ position: 'relative', left: '-50%', width: '100%' }}
          onClick={
            isLastPage
              ? () => history.push(PATHS.CONTACTS)
              : () => setPageIndex(pageIndex + 1)
          }
        >
          {isLastPage ? 'Done' : 'Next'}
        </PrimaryButton>
      </div>
    </Container>
  );
}
