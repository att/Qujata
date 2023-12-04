import { AttSelectOption } from "../../../shared/components/att-select";
import { IHttp, useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useState } from "react";
import { APIS } from "../../../apis";

export interface IUseGetAlgorithms {
    algorithmOptions: AttSelectOption[];
}

interface IAlgorithm {
    classic: string[];
    hybrid: string[];
    quantumSafe: string[];
}

export const algorithmSections = ['All', 'Classic', 'Hybrid', 'PQ'];
export function useGetAlgorithms(): IUseGetAlgorithms {
    const [algorithmOptions, setOptions] = useState<AttSelectOption[]>([]);
    const { get, data, cancelRequest }: IHttp<IAlgorithm> = useFetch({ url: APIS.algorithms });

    useEffect(() => {
        get();
        return cancelRequest;
    }, [get, cancelRequest]);


    useEffect(() => {
        if (data) {
            const algorithmTitles: AttSelectOption[] = algorithmSections.map((algo: string) => ({ label: algo, value: algo, isDisabled: true }));
            const classicOptions: AttSelectOption[] = data.classic.map((algo: string) => ({ label: algo, value: algo }));
            const hybridOptions: AttSelectOption[] = data.hybrid.map((algo: string) => ({ label: algo, value: algo }));
            const quantumSafeOptions: AttSelectOption[] = data.quantumSafe.map((algo: string) => ({ label: algo, value: algo }));

            setOptions([
                algorithmTitles[0],
                algorithmTitles[1],
                ...classicOptions,
                algorithmTitles[2],
                ...hybridOptions,
                algorithmTitles[3],
                ...quantumSafeOptions
            ]);
        }
    }, [data]);

    return { algorithmOptions };
}
