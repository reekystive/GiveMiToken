/// <reference types="vite/client" />

declare module '*.txt' {
  const value: string;
  export default value;
}
