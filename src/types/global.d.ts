// we need to override the default NodeJS for TypeScript
// to be able to set the appRoot as global variable to use in the swagger ui
declare namespace NodeJS {
    export interface Global {
      appRoot: string
    }
  }