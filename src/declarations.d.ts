declare function fetch(input: RequestInfo, init?: RequestInit): any;

declare type AnyFixMe = any;

// Used to avoid the no-explicit-any ESLint rule explicitly. In some cases, it
// is totally OK to just say it's `any`:
declare type AnyValid = any;

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: AnyValid;
}

declare namespace jest {
  // @ts-ignore
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toBeEmpty(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeInvalid(): R;
    toBeRequired(): R;
    toBeValid(): R;
    toContainElement(element: HTMLElement | SVGElement | null): R;
    toContainHTML(htmlText: string): R;
    toHaveAttribute(attr: string, value?: any): R;
    toHaveClass(...classNames: string[]): R;
    toHaveFocus(): R;
    toHaveFormValues(expectedValues: { [name: string]: any }): R;
    toHaveStyle(css: string): R;
    toHaveTextContent(
      text: string | RegExp,
      options?: { normalizeWhitespace: boolean },
    ): R;
    toHaveValue(value?: string | string[] | number): R;
    toHaveStyleRule(attrName: string, attrValue: string, selectors?: any): R;
  }
}
