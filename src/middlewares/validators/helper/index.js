export const mustBeUndefined = (val, helper) =>{
  if (val === undefined) {
    return true;
  } else {
    return helper.message('this key should not be set');
  }
};

export const mustBeNullOrUndefined = (val, helper) =>{
  if (val === undefined || val === null) {
    return true;
  } else {
    return helper.message('this key should be null or undefined');
  }
};
