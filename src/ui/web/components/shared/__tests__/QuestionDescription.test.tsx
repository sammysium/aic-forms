import {  render, screen } from "@testing-library/react"
import QuestionDescription from "../QuestionDescription"

describe('QuestionDescription', () => {
    test('render nothing', () => {
        const { container } = render(<QuestionDescription />);
        // eslint-disable-next-line testing-library/no-node-access
        expect(container.firstChild).toBeNull();
        })

    test('render description', () => {
        render(<QuestionDescription description="desc" />);
        expect(screen.getByText("desc")).toBeInTheDocument();
    })
})