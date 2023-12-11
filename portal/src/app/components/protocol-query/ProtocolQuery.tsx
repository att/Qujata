import { noop } from 'lodash';
import React, { useCallback, useState } from 'react';
import { OptionProps, Options, components } from 'react-select';
import { ITestParams } from '../../shared/models/quantum.interface';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../shared/components/att-button';
import { AttSelect, AttSelectOption } from '../../shared/components/att-select';
import styles from './ProtocolQuery.module.scss';
import { PROTOCOL_QUERY_EN } from './translate/en';
import { Spinner, SpinnerSize } from '../../shared/components/att-spinner';
import { useGetAlgorithms, useGetIterations } from './hooks';
import { handleAlgorithmsSelection } from './utils';
import { algorithmSections } from './constants';

export type SelectOptionType = AttSelectOption | Options<AttSelectOption> | null;
type onTextChangedEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type OnSelectChanged = (event: SelectOptionType) => void;

export interface ProtocolQueryProps {
  isFetching: boolean;
  canExportFile?: boolean;
  onRunClick: (data: ITestParams) => void;
  onDownloadDataClicked?: () => void;
}

export const ProtocolQuery: React.FC<ProtocolQueryProps> = (props: ProtocolQueryProps) => {
  const { isFetching, canExportFile, onRunClick, onDownloadDataClicked } = props;
  const { algorithmOptions, algosBySection } = useGetAlgorithms();
  const { iterationsOptions } = useGetIterations();
  
  const [experimentName, setExperimentName] = useState('');
  const [algorithms, setAlgorithms] = useState<SelectOptionType>();
  const [prevSelectedValues, setPrevSelectedValues] = useState<string[]>([]);
  const [iterationsCount, setIterationsCount] = useState<SelectOptionType>();

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRunClick({ experimentName, algorithms: algorithms as SelectOptionType, iterationsCount: iterationsCount as SelectOptionType });
  };

  const onExperimentNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExperimentName(event.target.value);
  };

  const onAlgorithmsChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
    let selectedAlgorithms: Options<AttSelectOption> = options as Options<AttSelectOption>;
    
    const { newSelectedOptions, selectedValues } = 
      handleAlgorithmsSelection(selectedAlgorithms, algorithmOptions, algosBySection, prevSelectedValues);

    // Update the selected algorithms and the previous selected values
    setAlgorithms(newSelectedOptions);
    setPrevSelectedValues(selectedValues);
  }, [algosBySection, algorithmOptions, prevSelectedValues]);

  const onIterationsNumChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
    const selectedIterationNum: Options<AttSelectOption> = options as Options<AttSelectOption>;
    setIterationsCount(selectedIterationNum);
  }, []);
  

  const AlgorithmsCheckboxOption: React.FC<OptionProps> = (props: OptionProps) => {
    const isSectionTitle = algorithmSections.includes((props.data as AttSelectOption).value);
    const optionStyle = isSectionTitle ? styles.algorithms_input_option_title : styles.algorithms_input_option;

    return (
      <components.Option {...props}>
        <div>
          <input
            type="checkbox"
            className={optionStyle}
            checked={props.isSelected}
            onChange={() => onAlgorithmsChanged} />
        </div>
        <span>{props.label}</span>
      </components.Option>
    );
  };

  const IterationsCheckboxOption: React.FC<OptionProps> = (props: OptionProps) => {
    return (
      <components.Option {...props}>
        <div>
          <input
            type="checkbox"
            className={styles.iterations_input_option}
            checked={props.isSelected}
            onChange={() => onIterationsNumChanged} />
        </div>
        <span>{props.label}</span>
      </components.Option>
    );
  };

  return (
    <div className={styles.protocol_query_wrapper}>
      <div>
        <h2 className={styles.experiment_title}>{PROTOCOL_QUERY_EN.TITLE}</h2>
        <div className={styles.note}>
          <span className={styles.note_title}>{PROTOCOL_QUERY_EN.NOTE.TITLE}</span>
          <p>{PROTOCOL_QUERY_EN.NOTE.TEXT}</p>
        </div>
      </div>
      <form className={styles.wrapper} data-testid='protocol-query-form' onSubmit={onSubmitHandler}>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.EXPERIMENT_NAME} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input_form_item}
                onChange={onExperimentNameChanged}
                placeholder=''
                required
              />
          </div>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.ALGORITHM} <span className={styles.required}>*</span>
              </label>
              <AttSelect
                className={styles.select_form_item}
                options={algorithmOptions}
                placeholder=''
                value={algorithms as AttSelectOption[]}
                onChange={onAlgorithmsChanged}
                isMulti
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                required
                customComponent={{ Option: AlgorithmsCheckboxOption as React.FC }}
              />
          </div>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.ITERATIONS_NUMBER} <span className={styles.required}>*</span>
              </label>
              <AttSelect
                className={styles.select_form_item}
                options={iterationsOptions}
                placeholder={PROTOCOL_QUERY_EN.FIELDS_LABEL.PLACEHOLDER}
                value={iterationsCount as AttSelectOption}
                onChange={onIterationsNumChanged}
                isMulti
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                required
                customComponent={{ Option: IterationsCheckboxOption as React.FC }}
              />
          </div>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.DESCRIPTION}
              </label>
              <textarea className={styles.form_item_text_area}></textarea>
          </div>
          <div className={styles.submitButtonWrapper}>
              <Button
                disabled={isFetching}
                actionType={ButtonActionType.SUBMIT}
                size={ButtonSize.LARGE}
                styleType={ButtonStyleType.PRIMARY}
                onButtonClick={noop}
                className={styles.run_button}
              >
                {PROTOCOL_QUERY_EN.ACTION_BUTTONS.RUN}
              </Button>
              {isFetching && 
              <div role='status' className={styles.spinnerWrapper}>
                    <Spinner size={SpinnerSize.EXTRA_SMALL} />
                    <span className={styles.text}>{PROTOCOL_QUERY_EN.FETCH_DATA}</span>
              </div>}
          </div>
       </form>
       {/* <Button
            className={styles.export_button}
            actionType={ButtonActionType.BUTTON}
            size={ButtonSize.LARGE}
            styleType={ButtonStyleType.PRIMARY}
            disabled={!canExportFile}
            onButtonClick={onDownloadDataClicked}
        >
          {PROTOCOL_QUERY_EN.ACTION_BUTTONS.EXPORT}
        </Button> */}
    </div>
  );
};
