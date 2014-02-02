module blah {
  export function worksAdd(a:number, b:number) {
    return a + b;
  }
  export function failsAdd(a:number, b:number) {
    return a + b + 1;
  }
}
