import { FC } from 'react';
import { ReferenceInput, SelectInput, InputProps } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  input: { width: 150 },
});

interface Props extends Omit<InputProps, 'source'> {
  source?: string;
}

// TODO: replace with custom AsyncSelectInput
const AgentInput: FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <ReferenceInput
      className={classes.input}
      reference="employees"
      source="agents"
      {...props}
    >
      <SelectInput source="name" />
    </ReferenceInput>
  );
};

AgentInput.defaultProps = {
  source: 'agents',
};

export default AgentInput;
