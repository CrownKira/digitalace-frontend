import { useTranslate } from 'react-admin';

// https://stackoverflow.com/questions/51940157/how-to-align-horizontal-icon-and-text-in-material-ui
export const IconText = ({
  children,
  text = '',
}: {
  children: React.ReactNode;
  text: React.ReactNode;
}) => {
  const translate = useTranslate();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        margin: '0.3em',
      }}
    >
      {children}&nbsp;&nbsp;
      <span>{typeof text === 'string' ? translate(text) : text}</span>
    </div>
  );
};
