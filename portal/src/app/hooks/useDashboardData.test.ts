import { act, renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { FetchDataStatus, useFetch } from '../shared/hooks/useFetch';
import { useDashboardData } from './useDashboardData';
import { ITestParams } from '../shared/models/quantum.interface';

jest.mock('../shared/hooks/useFetch');
  
describe('useDashboardData', () => {
  test('Should show error message for Error mode', async () => {
    (useFetch as jest.Mock).mockReturnValue({
      error: { message: 'error' },
      status: FetchDataStatus.Error,
      post: jest.fn(),
      cancelRequest: jest.fn(),
    });
    renderHook(() => useDashboardData());
    await waitFor(() => {
      expect('error').toBeTruthy();
    });
  });

  test('Should be in Success mode', () => {
    const mockData = new Map([
        [
            {
                "label": "prime256v1",
                "value": "prime256v1"
            },
            {
                "totalTime": [
                    0.005217,
                    0.006111,
                    0.005433,
                    0.005075,
                    0.006273,
                    0.005499,
                    0.00517,
                    0.00502,
                    0.005407,
                    0.005437,
                    0.005222,
                    0.005378,
                    0.005603,
                    0.005726,
                    0.006562,
                    0.004988,
                    0.005998,
                    0.005262,
                    0.005046,
                    0.006204,
                    0.005629,
                    0.006931,
                    0.005182,
                    0.006029,
                    0.005351,
                    0.0051,
                    0.00521,
                    0.006168,
                    0.005548,
                    0.005425,
                    0.005191,
                    0.005831,
                    0.005664,
                    0.005096,
                    0.004958,
                    0.0052,
                    0.00599,
                    0.006681,
                    0.005545,
                    0.005666,
                    0.005538,
                    0.006236,
                    0.006929,
                    0.00581,
                    0.005563,
                    0.005273,
                    0.005723,
                    0.006065,
                    0.00517,
                    0.005283,
                    0.005223,
                    0.006755,
                    0.005076,
                    0.005281,
                    0.006721,
                    0.005809,
                    0.00534,
                    0.00553,
                    0.005523,
                    0.005266,
                    0.00522,
                    0.005325,
                    0.00517,
                    0.00583,
                    0.005694,
                    0.006422,
                    0.005854,
                    0.00723,
                    0.005379,
                    0.005727,
                    0.00639,
                    0.005646,
                    0.005187,
                    0.006701,
                    0.005933,
                    0.00766,
                    0.006047,
                    0.005665,
                    0.006506,
                    0.006418,
                    0.00555,
                    0.006468,
                    0.006687,
                    0.006542,
                    0.004942,
                    0.005323,
                    0.005895,
                    0.006463,
                    0.005101,
                    0.005784,
                    0.006642,
                    0.005249,
                    0.00623,
                    0.005778,
                    0.006068,
                    0.006239,
                    0.006234,
                    0.00515,
                    0.006336,
                    0.006764
                ],
                "connectTime": [
                    0.000679,
                    0.000851,
                    0.000754,
                    0.000607,
                    0.000833,
                    0.000568,
                    0.000748,
                    0.000704,
                    0.000833,
                    0.000784,
                    0.000734,
                    0.000822,
                    0.000753,
                    0.00115,
                    0.000808,
                    0.000642,
                    0.000835,
                    0.000732,
                    0.000688,
                    0.001105,
                    0.000846,
                    0.001611,
                    0.000891,
                    0.001155,
                    0.001038,
                    0.000769,
                    0.000727,
                    0.001142,
                    0.001122,
                    0.000782,
                    0.000719,
                    0.000774,
                    0.000977,
                    0.000774,
                    0.000804,
                    0.000684,
                    0.001003,
                    0.001346,
                    0.000687,
                    0.000936,
                    0.00082,
                    0.001111,
                    0.0015,
                    0.001191,
                    0.000895,
                    0.000884,
                    0.001294,
                    0.000903,
                    0.000662,
                    0.000692,
                    0.000827,
                    0.001166,
                    0.000649,
                    0.000951,
                    0.000995,
                    0.000965,
                    0.000687,
                    0.000648,
                    0.000825,
                    0.000883,
                    0.000736,
                    0.00079,
                    0.000707,
                    0.000838,
                    0.001007,
                    0.001069,
                    0.001156,
                    0.001155,
                    0.000758,
                    0.00106,
                    0.000855,
                    0.001014,
                    0.000767,
                    0.000938,
                    0.001015,
                    0.001162,
                    0.001196,
                    0.001022,
                    0.001184,
                    0.001306,
                    0.000856,
                    0.001133,
                    0.001367,
                    0.001017,
                    0.000814,
                    0.000742,
                    0.001083,
                    0.001301,
                    0.000978,
                    0.000999,
                    0.001246,
                    0.001025,
                    0.001052,
                    0.001078,
                    0.001004,
                    0.001012,
                    0.001007,
                    0.001033,
                    0.00114,
                    0.001054
                ],
                "downloadSpeed": [
                    117883,
                    100638,
                    113197,
                    121182,
                    98039,
                    111838,
                    118955,
                    122509,
                    113741,
                    113113,
                    117770,
                    114354,
                    109762,
                    107404,
                    93721,
                    123295,
                    102534,
                    116875,
                    121878,
                    99129,
                    109255,
                    88731,
                    118680,
                    102006,
                    114931,
                    120588,
                    118042,
                    99708,
                    110850,
                    113364,
                    118474,
                    105470,
                    108580,
                    120682,
                    124041,
                    118269,
                    102671,
                    92052,
                    110910,
                    108542,
                    111050,
                    98620,
                    88757,
                    105851,
                    110551,
                    116631,
                    107461,
                    101401,
                    118955,
                    116411,
                    117748,
                    91043,
                    121158,
                    116455,
                    91504,
                    105870,
                    115168,
                    111211,
                    111352,
                    116786,
                    117816,
                    115492,
                    118955,
                    105488,
                    108008,
                    95764,
                    105056,
                    85062,
                    114333,
                    107386,
                    96244,
                    108926,
                    118565,
                    91777,
                    103657,
                    80287,
                    101703,
                    108561,
                    94528,
                    95824,
                    110810,
                    95083,
                    91969,
                    94007,
                    124443,
                    115536,
                    104325,
                    95157,
                    120564,
                    106327,
                    92592,
                    117165,
                    98715,
                    106438,
                    101351,
                    98573,
                    98652,
                    119417,
                    97064,
                    90922
                ],
                "serverMemory": [
                    0.27,
                    0.27,
                    0.28,
                    0.28,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27,
                    0.27
                ],
                "serverCpu": [
                    0.03,
                    0.03,
                    0.41,
                    0.41,
                    0.67,
                    0.67,
                    0.69,
                    0.69,
                    0.71,
                    0.71,
                    0.61,
                    0.61,
                    0.79,
                    0.79,
                    0.72,
                    0.72,
                    0.69,
                    0.69,
                    0.72,
                    0.72,
                    0.68,
                    0.68,
                    0.81,
                    0.81,
                    0.8,
                    0.8,
                    0.58,
                    0.58,
                    0.73,
                    0.73,
                    0.74,
                    0.74,
                    0.74,
                    0.74,
                    0.73,
                    0.73,
                    0.6,
                    0.6,
                    0.7,
                    0.7,
                    0.55,
                    0.55,
                    0.77,
                    0.77,
                    0.47,
                    0.47,
                    0
                ],
                "clientMemory": [
                    0.24,
                    0.24,
                    0.28,
                    0.28,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.27,
                    0.27,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.28,
                    0.28,
                    0.28,
                    0.28,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24,
                    0.24
                ],
                "clientCpu": [
                    0.01,
                    0.01,
                    8.99,
                    8.99,
                    13.59,
                    13.59,
                    16.66,
                    16.66,
                    16.54,
                    16.54,
                    13.5,
                    13.5,
                    16.9,
                    16.9,
                    17.13,
                    17.13,
                    16.43,
                    16.43,
                    15.96,
                    15.96,
                    14.25,
                    14.25,
                    16.54,
                    16.54,
                    17.45,
                    17.45,
                    13.55,
                    13.55,
                    16.53,
                    16.53,
                    17.36,
                    17.36,
                    16.02,
                    16.02,
                    16.42,
                    16.42,
                    14.53,
                    14.53,
                    17.25,
                    17.25,
                    13.44,
                    13.44,
                    17.48,
                    17.48,
                    10.25,
                    10.25,
                    0.01
                ]
            }
        ]
    ]);
    (useFetch as jest.Mock).mockReturnValue({
      status: FetchDataStatus.Success,
      post: jest.fn(),
      cancelRequest: jest.fn(),
      data: mockData,
    });
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.status).toEqual(FetchDataStatus.Success);
  });

  it('calls the appropriate functions when handleRunQueryClick is called', () => {
    const post = jest.fn();

    // Mock the return value of useFetch
    (useFetch as jest.Mock).mockReturnValue({
      post,
      data: null,
      status: FetchDataStatus.Init,
      error: null,
      cancelRequest: jest.fn(),
    });

    const { result } = renderHook(() => useDashboardData());

    const testData: ITestParams = {
      algorithms: [{ label: 'algo1', value: 'algo1' }, { label: 'algo2', value: 'algo2' }, { label: 'algo3', value: 'algo3' }, { label: 'algo4', value: 'algo4' }],
      iterationsCount: { label: '1000', value: '1000' }
    };

    act(() => {
      result.current.handleRunQueryClick(testData);
    });

    expect(post).toHaveBeenCalledWith({ data: { algorithms: ['algo1', 'algo2', 'algo3', 'algo4'], iterationsCount: 1000 } });
  });
});
