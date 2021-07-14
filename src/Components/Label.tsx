import { FormLabel, makeStyles } from "@material-ui/core";

interface LabelBase {
  id: string,
  label: string,
  align?: 'left' | 'right',
  colorMode: 'normal' | 'reverse' | 'ignored'
}

const isLabelBase = (object: any): object is LabelBase => {
  return 'label' in object;
};

const QtyAvgLabelProps = (main: LabelBase): CompositeLabelProps => {
  return { 
    mainLabel: main,
    subLabels: [
      { id: 'avg', label: 'Avg', align: 'right', colorMode: 'ignored' },
      { id: 'qty', label: 'Qty', align: 'right', colorMode: 'ignored' }
    ]
  };
};

interface StackedLabelProps {
  labels: LabelBase[]
  classes?: any[]
}

interface CompositeLabelProps {
  mainLabel: LabelBase,
  subLabels: LabelBase[],
  mainLabelClass?: any,
  subLabelClasses?: any[]
}

const useStyleStackedLabel = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const StackedLabel = (props: StackedLabelProps) => {
  const { labels, classes } = props;
  const labelRoot = useStyleStackedLabel();
  return (
    <div className={labelRoot.root}>
      {labels.map((lbl, index) => {
        return (
          <FormLabel className={classes && classes[index]}>{lbl}</FormLabel>
        );
      })}
    </div>
  );
};

const useStyleCompositeLabel = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '50%',
    position: 'relative',
    top: '50%',
    left: 0
  },
}));

const CompositeLabel = (props: CompositeLabelProps) => {
  const {
    mainLabel: main,
    mainLabelClass: mainClass,
    subLabels: subs,
    subLabelClasses: subClasses
  } = props;
  const classes = useStyleCompositeLabel();

  return (
    <div className={classes.root}>
      <FormLabel className={mainClass}>{main}</FormLabel>
      <StackedLabel
        labels={subs}
        classes={subClasses}
      />
    </div>
  );
};

export {
  isLabelBase,
  QtyAvgLabelProps,
  StackedLabel,
  CompositeLabel
};
export type {
  LabelBase
};
