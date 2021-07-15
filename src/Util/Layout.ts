const WHITE40 = 'rgba(255, 255, 255, 0.4)';
const WHITE60 = 'rgba(255, 255, 255, 0.6)';
const WHITE80 = 'rgba(255, 255, 255, 0.8)';
const WHITE90 = 'rgba(255, 255, 255, 0.9)';
const ROBOTO_LIGHT = 100;
const ROBOTO_SEMILIGHT = 300;
const ROBOTO_REGULAR = 400;
const ROBOTO_SEMIBOLD = 500;
const ROBOTO_BOLD = 700;
const ROBOTO_EXTRABOLD = 900;

const CARD_CONTENT_CLASSES = {
  padding: '0.25rem 0.75rem 0.25rem 0.75rem',
  '&:last-child': {
    paddingBottom: '0.25rem'
  }
};

const TOOLTIP_CLASSES = {
  fontSize: '1rem',
  fontWeight: ROBOTO_REGULAR,
  color: WHITE80
};

const CARD_BUTTON_HEADER_LABEL_CLASSES = {
  color: 'white',
  fontSize: '1.25rem',
  fontWeight: ROBOTO_SEMILIGHT,
  textTransform: 'none' as any
};

const CARD_BUTTON_CLASSES = {
  backgroundColor: 'transparent',
  color: WHITE90,
  position: 'absolute' as any,
  right: 0
};

const ROW_CONTAINER_CLASSES = {
  display: 'flex',
  flexDirection: 'row' as any,
  position: 'relative' as any
};

const CARD_CLASSES = {
  backgroundColor: '#282c34',
  border: `1px solid ${WHITE40}`,
  borderRadius: 0,
  position: 'absolute' as any
};

const CARD_TITLE_CLASSES = {
  textAlign: 'left' as any,
  fontSize: '1.75rem',
  fontWeight: ROBOTO_SEMIBOLD,
  color: WHITE80,
  marginBottom: '1.75rem'
};

const HEADER_LABEL_CLASSES = {
  color: WHITE60 as any,
  fontSize: '1.25rem' as any,
  fontWeight: ROBOTO_LIGHT as any,
  marginBottom: '0.3rem' as any
};

const LABEL_CLASSES = {
  color: WHITE80 as any,
  fontSize: '1.25rem' as any,
  fontWeight: ROBOTO_LIGHT as any,
  marginBottom: '0.3rem' as any
}

const FLEX_COLUMN_CLASSES = {
  display: 'flex',
  flexDirection: 'column' as any
};

const FLEX_ROW_CLASSES = {
  display: 'flex',
  flexDirection: 'row' as any
};

const getRemInPixel = (): number => parseFloat(getComputedStyle(document.documentElement).fontSize); 

const ToRem = (pixel: number): string => `${pixel / getRemInPixel()}rem`;

export {
  WHITE40,
  WHITE60,
  WHITE80,
  WHITE90,
  ROBOTO_LIGHT,
  ROBOTO_SEMILIGHT,
  ROBOTO_REGULAR,
  ROBOTO_SEMIBOLD,
  ROBOTO_BOLD,
  ROBOTO_EXTRABOLD,
  CARD_CONTENT_CLASSES,
  TOOLTIP_CLASSES,
  CARD_BUTTON_HEADER_LABEL_CLASSES,
  CARD_BUTTON_CLASSES,
  ROW_CONTAINER_CLASSES,
  CARD_CLASSES,
  CARD_TITLE_CLASSES,
  HEADER_LABEL_CLASSES,
  LABEL_CLASSES,
  FLEX_COLUMN_CLASSES,
  FLEX_ROW_CLASSES,
  getRemInPixel,
  ToRem
}
