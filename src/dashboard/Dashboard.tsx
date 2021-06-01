import { FC, CSSProperties } from 'react';
import { useMediaQuery, Theme } from '@material-ui/core';

import Welcome from './Welcome';

const styles = {
  flex: { display: 'flex' },
  flexColumn: { display: 'flex', flexDirection: 'column' },
  leftCol: { flex: 1, marginRight: '0.5em' },
  rightCol: { flex: 1, marginLeft: '0.5em' },
  singleCol: { marginTop: '1em', marginBottom: '1em' },
};

// interface State {}

// const Spacer = () => <span style={{ width: '1em' }} />;
// const VerticalSpacer = () => <span style={{ height: '1em' }} />;

const Dashboard: FC = () => {
  // const [state, setState] = useState<State>({});
  // const version = useVersion();
  // const dataProvider = useDataProvider();
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs')
  );
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  // const fetchOrders = useCallback(async () => {}, [dataProvider]);
  // const fetchReviews = useCallback(async () => {}, [dataProvider]);

  // useEffect(() => {
  //   // fetchOrders();
  //   // fetchReviews();
  // }, [version]);

  // const {} = state;
  // qn: why style.flex doesn't need CSSProperties
  return isXSmall ? (
    <div>
      <div style={styles.flexColumn as CSSProperties}>
        <Welcome />
      </div>
    </div>
  ) : isSmall ? (
    <div style={styles.flexColumn as CSSProperties}>
      <div style={styles.flex}>
        <Welcome />
      </div>
    </div>
  ) : (
    <>
      <Welcome />
    </>
  );
};

export default Dashboard;
