// 문제 유형 관련 상수들
export const PROBLEM_TYPES = {
    CODE_SUBMISSION: 0,
    ALGORITHM_LOGIC: 1,
    ALGORITHM_ANALYSIS: 4
};

export const PROBLEM_TYPE_OPTIONS = [
    { value: PROBLEM_TYPES.CODE_SUBMISSION, label: '코드 제출용' },
    { value: PROBLEM_TYPES.ALGORITHM_LOGIC, label: '알고리즘 로직 분석용' },
    // { value: PROBLEM_TYPES.ALGORITHM_ANALYSIS, label: '알고리즘 문제 분석용' }
];

// 테스트 케이스가 필요한 문제 유형들
export const TYPES_REQUIRING_TEST_CASES = [
    PROBLEM_TYPES.CODE_SUBMISSION,
    PROBLEM_TYPES.ALGORITHM_ANALYSIS
];

// 입력/출력 예제가 필요한 문제 유형들
export const TYPES_REQUIRING_EXAMPLES = [
    PROBLEM_TYPES.CODE_SUBMISSION,
    PROBLEM_TYPES.ALGORITHM_ANALYSIS
];

// 문제 유형별 안내 메시지
export const PROBLEM_TYPE_MESSAGES = {
    [PROBLEM_TYPES.CODE_SUBMISSION]: [
        '✅ 여러개의 입력을 받을 시, 스페이스바로 구분하여 입력하시오. (10과 20을 입력받아야 할 경우 "10 20")',
        '✅ 테스트 케이스 생성 버튼을 클릭하면 AI가 문제에 맞는 입력 예제, 출력 예제를 자동으로 생성합니다.',
        '✅ 문제 유형을 변경하여 원하는 문제를 만드세요!'
    ],
    [PROBLEM_TYPES.ALGORITHM_LOGIC]: [
        '✅ 알고리즘 풀이를 프로그래밍 언어가 아닌 한글로 풀 수 있습니다.'
    ],
    [PROBLEM_TYPES.ALGORITHM_ANALYSIS]: [
        '✅ 여러개의 입력을 받을 시, 스페이스바로 구분하여 입력하시오. (10과 20을 입력받아야 할 경우 "10 20")',
        '✅ 테스트 케이스 생성 버튼을 클릭하면 AI가 문제에 맞는 입력 예제, 출력 예제를 자동으로 생성합니다.',
        '✅ 문제 유형을 변경하여 원하는 문제를 만드세요!'
    ]
};

// 제약사항 placeholder 텍스트
export const CONSTRAINTS_PLACEHOLDERS = {
    [PROBLEM_TYPES.CODE_SUBMISSION]: "예: 입력값은 -1000 이상 1000 이하의 정수입니다.",
    [PROBLEM_TYPES.ALGORITHM_LOGIC]: "예: 알고리즘을 5단계로 나눠서 작성하세요.",
    [PROBLEM_TYPES.ALGORITHM_ANALYSIS]: "예: 입력값은 -1000 이상 1000 이하의 정수입니다."
};