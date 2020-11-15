export const bindAllFunctionsToSelf = (object: {[key: string]: any}) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(object))
    .forEach((property) => {
      if (typeof object[property] === 'function') {
        object[property] = object[property].bind(object);
      }
    });
};