import { FC } from 'react';
import { ReferenceInput, SelectInput, InputProps } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  input: { width: 150 },
});

interface Props extends Omit<InputProps, 'source'> {
  // this is needed since the source might be different but still refers to agent
  source?: string;
}

// TODO: replace with custom AsyncSelectInput
export const AgentInput: FC<Props> = (props) => {
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
