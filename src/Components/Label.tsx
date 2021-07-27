import {
  FormLabel,
  Typography,
  makeStyles
} from "@material-ui/core";
import clsx from 'clsx';
import {
  HEADER_LABEL_CLASSES,
  FLEX_COLUMN_CLASSES,
  LABEL_CLASSES,
  LABEL_CONTENT_POSITIVE_CLASSES,
  LABEL_CONTENT_NEGATIVE_CLASSES,
  genRandomHex,
  messages
} from "../Util";
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { IconProps, NamedIconButton } from "./Icon";
import { useIntl } from "react-intl";

interface LabelBaseProps {
  id?: string,
  label?: string,
  align?: 'left' | 'right',
  colorMode?: ColorMode,
  classes?: any,
  icon?: IconProps
}

type ColorMode = 'normal' | 'reverse' | 'ignored';

const isLabelBaseProps = (object: any): object is LabelBaseProps => {
  return 'label' in object;
};

const isStackedLabel = (object: any): object is StackedLabelProps => {
  return 'otherLabels' in object;
};

const isCompositeLabel = (object: any): object is CompositeLabelProps => {
  return 'subLabels' in object;
};

interface StackedLabelProps extends LabelBaseProps {
  otherLabels?: LabelBaseProps[]
}

interface CompositeLabelProps extends LabelBaseProps {
  subLabels?: LabelBaseProps[]
}

interface LabelColumnProps {
  labels: LabelBaseProps[],
  content: (string | undefined)[],
  classes?: ClassNameMap<'column'|'label'|'content'>
}

interface LabelRowProps {
  labels: LabelBaseProps[],
  content: (string | undefined)[],
  classes?: any
}

interface LabelTableProps {
  title?: string,
  children: React.ReactElement<LabelColumnProps | LabelRowProps>[],
  classes?: ClassNameMap<'container'|'title'>
}

const QtyAvgLabelProps = (main: LabelBaseProps): CompositeLabelProps => {
  return { 
    id: main.id,
    label: main.label,
    align: main.align,
    colorMode: main.colorMode,
    classes: main.classes,
    subLabels: [
      { id: 'avg', label: 'average', align: 'right', colorMode: 'ignored' },
      { id: 'qty', label: 'quantity', align: 'right', colorMode: 'ignored' }
    ]
  };
};

const setLabelBasePropsValue = (lbl: LabelBaseProps, value: string): LabelBaseProps => {
  return {
    ...lbl,
    label: value
  }
};

const setLabelBasePropsValues = (lbls: LabelBaseProps[], values: string[]): LabelBaseProps[] => {
  let newLbl: LabelBaseProps[] = [];
  lbls.forEach((lbl, index) => {
    newLbl.push(setLabelBasePropsValue(lbl, values[index]));
  });
  return newLbl;
}

const setStackedLabelValues = (lbl: StackedLabelProps, values: string[], icons?: (IconProps | undefined)[], classes?: any[]): StackedLabelProps => {
  if (lbl.otherLabels === undefined)
    return lbl;

  let newLbl: LabelBaseProps[] = [];
  values.forEach((v, index) => {
    newLbl.push({
      ...lbl.otherLabels![index],
      label: v,
      icon: icons ? icons[index] : undefined,
      classes: classes ? classes[index] : undefined
    });
  });
  return {
    ...lbl,
    otherLabels: newLbl
  }
};

const LableBasesToStackedLabel = (lbls: LabelBaseProps[]): StackedLabelProps => {
  return {
    otherLabels: lbls
  }
};

const tryParseToNumber = (value: string | undefined): number => {
  return value ? +(value.toString().replace(/\,/gi,'').replace(' HKD', '')) : NaN;
};

const tryParseLabelToNumber = (lbl: LabelBaseProps): number => {
  return (lbl === undefined || lbl.label === undefined) ? NaN : tryParseToNumber(lbl.label);
};

const tryParseLabelContentToNumber = (lbl: LabelBaseProps, content: string | undefined): number => {
  return (lbl !== undefined || content !== undefined) ? NaN : tryParseToNumber(content);
}

const getNumberContentClassString = (rootClass: any, numberContent: number, colorMode?: ColorMode, overridingClass?: any): string => {
  return clsx(overridingClass?.content ?? rootClass.content, {
    [overridingClass?.negative ?? rootClass.negative]: !isNaN(numberContent) 
                                                      && ((numberContent < 0 && colorMode === 'normal') 
                                                      || (numberContent > 0 && colorMode === 'reverse')),
    [overridingClass?.positive ?? rootClass.positive]: !isNaN(numberContent) 
                                                      && ((numberContent > 0 && colorMode === 'normal') 
                                                      || (numberContent < 0 && colorMode === 'reverse')),
  })
};

const useStyleLabel = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    marginRight: '1rem'
  },
  label: HEADER_LABEL_CLASSES,
  content: LABEL_CLASSES,
  positive: LABEL_CONTENT_POSITIVE_CLASSES,
  negative: LABEL_CONTENT_NEGATIVE_CLASSES
}));

const LabelBase = (props: LabelBaseProps) => {
  const { label, colorMode, icon, classes } = props;
  const labelRoot = useStyleLabel();
  const n = tryParseToNumber(props.label);
  const customStyle = makeStyles<"root">(() => (classes))().root;
  const numberStyle =  getNumberContentClassString(labelRoot, n, colorMode, classes);
  const intl = useIntl();
  const content = label !== undefined ? messages[intl.locale][label] : label;

  return (
    <FormLabel
      className={clsx(customStyle, labelRoot.content, numberStyle)}
      key={genRandomHex(16)}
    >
      {icon ? <NamedIconButton name={icon.name} size={icon.size} buttonStyle={icon.buttonStyle} otherProps={icon.otherProps}/> : null}
      {content ? content : label}
    </FormLabel>
  );
}

const useStyleStackedLabel = makeStyles((theme) => ({
  root: {
    ...FLEX_COLUMN_CLASSES,
    position: 'relative',
    right: 0
  }
}));

const StackedLabel = (props: StackedLabelProps) => {
  const { classes, otherLabels } = props;
  const labelRoot = useStyleLabel();
  const stackedLabelRoot = useStyleStackedLabel();
  const customStyle = makeStyles<"root">(() => (classes))().root;

  return (
    <div className={clsx(stackedLabelRoot.root, customStyle)}>
      {otherLabels?.map((lbl, index) => {
        const n = tryParseLabelToNumber(lbl);
        return (
          <LabelBase
            id={lbl.id}
            label={lbl.label}
            align={lbl.align}
            colorMode={lbl.colorMode}
            classes={lbl.classes}
            icon={lbl.icon}
            key={genRandomHex(16)}
          />
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
  const intl = useIntl();
  const content = label !== undefined ? messages[intl.locale][label] : label;

  return (
    <div className={labelRoot.root}>
      <FormLabel
        className={clsx(labelRoot.main, customClasses)}
        key={genRandomHex(16)}
      >
        {content ? content : label}
      </FormLabel>
      <StackedLabel
        classes={labelRoot.stack}
        otherLabels={subs}
      />
    </div>
  );
};

const LabelColumn = (props: LabelColumnProps) => {
  const { labels, content, classes } = props;
  const labelRoot = useStyleLabel();
  const intl = useIntl();

  return (
    <div className={classes?.column}>
      {labels.map((lbl, index) => {
        const n = tryParseLabelContentToNumber(lbl, content[index]);
        const label = lbl.label !== undefined ? messages[intl.locale][lbl.label] : lbl.label;

        return (
          <div id={lbl.id} className={labelRoot.root}>
            <FormLabel
              className={classes?.label ?? labelRoot.label}
              key={genRandomHex(16)}
            >
              {label}
            </FormLabel>
            <FormLabel
              className={clsx(getNumberContentClassString(labelRoot, n, lbl.colorMode, classes))}
              key={genRandomHex(16)}
            >
              {content[index] ?? '?'}
            </FormLabel>
          </div>
        );
      })}
    </div>
  );
};

const useStyleLabelHorizontal = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    marginRight: '1rem'
  }
}));

const LabelRow = (props: LabelRowProps) => {
  const { labels, content, classes } = props;
  const labelRoot = useStyleLabel();
  const horizontalLabelRoot = useStyleLabelHorizontal();
  const intl = useIntl();

  return (
    <div className={classes?.row}>
      {labels.map((lbl, index) => {
        const n = tryParseLabelContentToNumber(lbl, content[index]);
        const label = lbl.label !== undefined ? messages[intl.locale][lbl.label] : lbl.label;

        return (
          <div id={lbl.id} className={horizontalLabelRoot.root}>
            <FormLabel
              className={classes?.label}
              key={genRandomHex(16)}
            >
              {label}
            </FormLabel>
            <FormLabel
              className={clsx(getNumberContentClassString(labelRoot, n, lbl.colorMode, classes))}
              key={genRandomHex(16)}
            >
              {content[index] ?? '?'}
            </FormLabel>
          </div>
        );
      })}
    </div>
  );
}

const useStylesLabelTable = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row'
  }
}));

const LabelTable = (props: LabelTableProps) => {
  const { title, children, classes } = props;
  const tableRoot = useStylesLabelTable();
  return (
    <div className={classes?.container}>
      {title ? <Typography className={classes?.title}>{title}</Typography> : null}
      <div className={tableRoot.root}>
        {children}
      </div>
    </div>
  );
};

export {
  isLabelBaseProps,
  isStackedLabel,
  isCompositeLabel,
  setLabelBasePropsValue,
  setLabelBasePropsValues,
  setStackedLabelValues,
  getNumberContentClassString,
  LableBasesToStackedLabel,
  QtyAvgLabelProps,
  LabelBase,
  StackedLabel,
  CompositeLabel,
  LabelRow,
  LabelColumn,
  LabelTable
};
export type {
  ColorMode,
  LabelBaseProps,
  StackedLabelProps,
  CompositeLabelProps
};
