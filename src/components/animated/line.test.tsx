import "@testing-library/jest-dom";
import { render, screen, prettyDOM } from "@testing-library/react";

import Line from "./line";

describe("<Line>", () => {
    const msg = "Hello, world!";
    render(<Line>{msg}</Line>);

    let component = screen.getByRole("text");

    it("should render", () => {
        expect(component).toBeInTheDocument();
    });
    it("should be invisible", () => {
        expect(component).toHaveStyle("opacity: 0");
    });
    it("should render text", () => {
        expect(component).toHaveTextContent(msg);
        console.log(prettyDOM(component));
    });
});