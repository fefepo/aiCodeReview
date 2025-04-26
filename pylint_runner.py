import sys
from pylint import lint

def run_pylint(file_path):
    # pylint 실행: do_exit=False 제거
    pylint_output = lint.Run([file_path], exit=False)
    
    # pylint 출력 결과
    print(pylint_output.linter.reporter.messages)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python pylint_runner.py <file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    run_pylint(file_path)
