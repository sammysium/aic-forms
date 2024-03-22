
import { render, screen } from "@testing-library/react";
import QuestionPrefixSuffix from "../QuestionPrefixSuffix";

describe('QuestionPrefixSuffix', () => {

    test('renders children with no prefix and no suffix', () => {
        render(<QuestionPrefixSuffix><span>Daniel</span></QuestionPrefixSuffix>)
        const element = screen.getByText("Daniel");
        expect(element).toBeInTheDocument();
    })

    test('renders children with  prefix and no suffix', () => {
        render(<QuestionPrefixSuffix prefix="prefix content"><span>Daniel</span></QuestionPrefixSuffix>)
        const content = screen.getByText("Daniel");
        const prefix = screen.getByText("prefix content")
        expect(content).toBeInTheDocument();
        expect(prefix).toBeInTheDocument();
    })

    test('renders children with no prefix and suffix', () => {
        render(<QuestionPrefixSuffix suffix="suffix content"><span>Daniel</span></QuestionPrefixSuffix>)
        const content = screen.getByText("Daniel");
        const suffix = screen.getByText("suffix content")
        expect(content).toBeInTheDocument();
        expect(suffix).toBeInTheDocument();
    })

    test('renders children with prefix and suffix', () => {
        render(<QuestionPrefixSuffix suffix="suffix content" prefix="prefix content"><span>Daniel</span></QuestionPrefixSuffix>)
        const content = screen.getByText("Daniel");
        const suffix = screen.getByText("suffix content")
        const prefix = screen.getByText("prefix content")
        expect(content).toBeInTheDocument();
        expect(suffix).toBeInTheDocument();
        expect(prefix).toBeInTheDocument();
    })
})