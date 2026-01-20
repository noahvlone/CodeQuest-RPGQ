import axios from 'axios';
import { env } from '../config/env.js';
import { ITestCase } from '../models/Challenge.js';

interface PistonExecuteResponse {
    run: {
        stdout: string;
        stderr: string;
        code: number;
        signal: string | null;
        output: string;
    };
    compile?: {
        stdout: string;
        stderr: string;
        code: number;
    };
}

interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    executionTime: number;
}

interface TestResult {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    isHidden: boolean;
}

interface ValidationResult {
    allPassed: boolean;
    totalTests: number;
    passedTests: number;
    results: TestResult[];
    executionTime: number;
}

const LANGUAGE_VERSIONS: Record<string, string> = {
    javascript: '18.15.0',
    python: '3.10.0',
    typescript: '5.0.3',
};

export class CodeRunnerService {
    private pistonUrl = env.PISTON_API_URL;

    async execute(code: string, language: string, stdin = ''): Promise<ExecutionResult> {
        const startTime = Date.now();

        try {
            const response = await axios.post<PistonExecuteResponse>(
                `${this.pistonUrl}/execute`,
                {
                    language,
                    version: LANGUAGE_VERSIONS[language] || '*',
                    files: [{ content: code }],
                    stdin,
                    run_timeout: 10000, // 10 seconds max
                    compile_timeout: 10000,
                },
                {
                    timeout: 15000,
                }
            );

            const executionTime = Date.now() - startTime;
            const { run, compile } = response.data;

            // Check for compile errors
            if (compile && compile.code !== 0) {
                return {
                    success: false,
                    output: '',
                    error: compile.stderr || 'Compilation failed',
                    executionTime,
                };
            }

            // Check for runtime errors
            if (run.code !== 0 || run.stderr) {
                return {
                    success: false,
                    output: run.stdout,
                    error: run.stderr || `Exit code: ${run.code}`,
                    executionTime,
                };
            }

            return {
                success: true,
                output: run.stdout.trim(),
                executionTime,
            };
        } catch (error) {
            const executionTime = Date.now() - startTime;
            console.error('Code execution error:', error);

            return {
                success: false,
                output: '',
                error: 'Code execution service unavailable',
                executionTime,
            };
        }
    }

    async validateSolution(
        code: string,
        language: string,
        testCases: ITestCase[]
    ): Promise<ValidationResult> {
        const startTime = Date.now();
        const results: TestResult[] = [];
        let passedTests = 0;

        for (const testCase of testCases) {
            // Wrap user code to call solve function with input
            const wrappedCode = this.wrapCode(code, testCase.input, language);

            const execution = await this.execute(wrappedCode, language);

            const passed = execution.success &&
                execution.output.trim() === testCase.expectedOutput.trim();

            if (passed) passedTests++;

            results.push({
                passed,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: execution.error || execution.output,
                isHidden: testCase.isHidden,
            });
        }

        return {
            allPassed: passedTests === testCases.length,
            totalTests: testCases.length,
            passedTests,
            results,
            executionTime: Date.now() - startTime,
        };
    }

    private wrapCode(userCode: string, input: string, language: string): string {
        if (language === 'javascript') {
            return `
${userCode}

// Execute and print result
const input = ${input};
const result = solve(input);
console.log(JSON.stringify(result));
`;
        }

        if (language === 'python') {
            return `
${userCode}

# Execute and print result
import json
input_val = ${input}
result = solve(input_val)
print(json.dumps(result))
`;
        }

        return userCode;
    }

    calculateDamage(passedTests: number, totalTests: number, baseReward: number): number {
        const successRate = passedTests / totalTests;
        return Math.floor(baseReward * successRate);
    }
}

export const codeRunnerService = new CodeRunnerService();
