'use strict';

function validateForm(options) {
  const {
    formId,
    formValidClass,
    formInvalidClass,
    inputErrorClass
  } = options;
  const form = document.getElementById(formId);
  const inputs = [...form.querySelectorAll('input')];

  inputs.forEach((el => {
    el.addEventListener('blur', validateInput, true);
    el.addEventListener('focus', removeErrorClass, true)
  }));
  form.addEventListener('submit', submitFields);

  function removeErrorClass() {
    if (this.classList.contains(inputErrorClass)) {
      this.classList.remove(inputErrorClass);
    }
  }

  function validateInput() {
    const {
      validator,
      validatorMin,
      validatorMax,
      validatorPattern
    } = this.dataset;
    const value = this.value;
    switch (validator) {
      case 'letters':
        let lettersMatch = !value.match(/^[a-zа-яё]+$/i);
        this.classList.toggle(inputErrorClass, lettersMatch);
        break;
      case 'number':
        if (validatorMin &&
          validatorMax) {
          let numberMinMaxMatch = value.length === 0 || isNaN(value) ||
            Number(value) < validatorMin || Number(value) > validatorMax;
          this.classList.toggle(inputErrorClass, numberMinMaxMatch);
        } else {
          let numberMatch = !this.value.match(/^-?\d+$/i)
          this.classList.toggle(inputErrorClass, numberMatch);
        }
        break;
      case 'regexp':
        let regexpMatch = !value.match(validatorPattern)
        this.classList.toggle(inputErrorClass, regexpMatch);
        break;
    }
  }

  function submitFields(e) {
    e.preventDefault();
    inputs.forEach(el => {
      if (el.value.length === 0 && el.dataset.hasOwnProperty('required')) validateInput.call(el);
    });
    const isHasError = elem => elem.classList.contains(inputErrorClass);
    const isValid = !inputs.some(isHasError);
    this.classList.toggle(formInvalidClass, !isValid);
    this.classList.toggle(formValidClass, isValid);
    // if (isValid) this.submit();
  }
};