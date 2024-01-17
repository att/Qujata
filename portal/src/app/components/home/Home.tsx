import { IUseDashboardData, useDashboardData } from "../../hooks/useDashboardData";
import { FetchDataStatus } from "../../shared/hooks/useFetch";
import { ITestParams } from "../../shared/models/quantum.interface";
import { ProtocolQuery } from "../protocol-query";
import { SubHeader } from "../sub-header";
import { useCallback, useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { useLocation, useNavigate } from "react-router-dom";
import { Experiment } from "../all-experiments/hooks";

export const Home: React.FC = () => {
    const [isSubHeaderOpen, setIsSubHeaderOpen] = useState<boolean>(true);
  
    const handleSubHeaderCloseClick: () => void = useCallback((): void => {
      setIsSubHeaderOpen(false);
    }, []);
    
    return (
      <>
        {isSubHeaderOpen && <SubHeader handleCloseClick={handleSubHeaderCloseClick} />}
        <HomeContent />
      </>
    );  
}

export const HomeContent: React.FC = () => {
  const { handleRunQueryClick, status, testSuiteId }: IUseDashboardData = useDashboardData();
  const navigate = useNavigate();
  const location = useLocation();
  const duplicateData: Experiment = location.state?.row;

  useEffect(() => {
    // after the duplicate data has been created, we need to clear the state
    location.state = undefined;
  }, [location]);

  useEffect(() => {
    if (status === FetchDataStatus.Success && testSuiteId) {
      // Navigate to the Experiment page
      navigate(`experiment/${testSuiteId}`,  { replace: true });
    }
  }, [navigate, status, testSuiteId]);
  
  const handleRunClick: (params: ITestParams) => void = useCallback((params: ITestParams): void => {
    if (params.experimentName && params.algorithms && params.iterationsCount) {
      handleRunQueryClick(params);
    }
  }, [handleRunQueryClick]);

  return (
    <div className={styles.app_wrapper}>
      <ProtocolQuery
        isFetching={status === FetchDataStatus.Fetching}
        onRunClick={handleRunClick}
        duplicateData={duplicateData}
      />
    </div>
  );
};
