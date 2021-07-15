import { FormLabel, makeStyles } from "@material-ui/core";
import clsx from 'clsx';
import {
  WHITE60,
  ROBOTO_LIGHT, 
  HEADER_LABEL_CLASSES,
  FLEX_COLUMN_CLASSES
} from "../Util";

interface LabelBase {
  id?: string,
  label?: string,
  align?: 'left' | 'right',
  colorMode?: 'normal' | 'reverse' | 'ignored',
  classes?: any
}

const isLabelBase = (object: any): object is LabelBase => {
  return 'label' in object;
};

const isStackedLabel = (object: any): object is StackedLabelProps => {
  return 'otherLabels' in object;
};

const isCompositeLabel = (object: any): object is CompositeLabelProps => {
  return 'subLabels' in object;
};

interface StackedLabelProps extends LabelBase {
  otherLabels?: LabelBase[]
}

interface CompositeLabelProps extends LabelBase {
  subLabels?: LabelBase[]
}

const QtyAvgLabelProps = (main: LabelBase): CompositeLabelProps => {
  return { 
    id: main.id,
    label: main.label,
    align: main.align,
    colorMode: main.colorMode,
    classes: main.classes,
    subLabels: [
      { id: 'avg', label: 'Avg', align: 'right', colorMode: 'ignored' },
      { id: 'qty', label: 'Qty', align: 'right', colorMode: 'ignored' }
    ]
  };
};

const useStyleStackedLabel = makeStyles((theme) => ({
  root: {
    ...FLEX_COLUMN_CLASSES,
    position: 'relative',
    right: 0
  },
  label: HEADER_LABEL_CLASSES
}));

const StackedLabel = (props: StackedLabelProps) => {
  const { classes, otherLabels } = props;
  const labelRoot = useStyleStackedLabel();
  const customStyle = makeStyles<"root">(() => (classes))().root;

  return (
    <div className={clsx(labelRoot.root, customStyle)}>
      {otherLabels?.map((lbl, index) => {
        return (
          <FormLabel className={lbl.classes ?? labelRoot.label}>{lbl.label}</FormLabel>
        );
      })}
    </div>
  );
};

const useStyleCompositeLabel = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    left: 0
  },
  main: {
    ...HEADER_LABEL_CLASSES,
    position: 'relative',
    left: 0,
    marginRight: '0.3rem',
    top: '0.6rem'
  },
  stack: {
    position: 'relative',
    right: 0
  }
}));

const CompositeLabel = (props: CompositeLabelProps) => {
  const {
    id, label, align, colorMode, classes, 
    subLabels: subs
  } = props;
  const labelRoot = useStyleCompositeLabel();
  const customClasses = makeStyles<"root">(() => (classes))().root;

  return (
    <div className={labelRoot.root}>
      <FormLabel className={clsx(labelRoot.main, customClasses)}>{label}</FormLabel>
      <StackedLabel
        classes={labelRoot.stack}
        otherLabels={subs}
      />
    </div>
  );
};

export {
  isLabelBase,
  isStackedLabel,
  isCompositeLabel,
  QtyAvgLabelProps,
  StackedLabel,
  CompositeLabel
};
export type {
  LabelBase,
  StackedLabelProps,
  CompositeLabelProps
};
