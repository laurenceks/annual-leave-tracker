const validateForm = (e, formRef, callBack, typeaheadStates = {}, passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) => {
    e.preventDefault();

    const inputsNotCheckedByRegex = ["text", "textarea", "password", "checkbox", "number", "radio"]

    let formIsValid = true;
    const invalidInputs = [];
    const validInputs = [];
    const values = {};
    const passIds = {};
    const formInputs = Array.isArray(formRef) ? formRef.map(x => {
        return document.getElementById(x);
    }) : typeof(formRef) === "string" ? document.querySelectorAll(formRef) : formRef.current.querySelectorAll("input:not(.rbt-input-hint), textarea");

    const updateOutput = (element, invalidate = true) => {
        if (invalidate) {
            element.classList.add("is-invalid");
            element.closest("div.formInputWrap")?.classList.add("is-invalid");
            invalidInputs.push(element);
            formIsValid = false;
        } else {
            element.classList.remove("is-invalid");
            element.closest("div.formInputWrap")?.classList.remove("is-invalid");
            validInputs.push(element);
            values[element.id] = element.value
        }
    }

    formInputs.forEach(x => {
        if (!x.value || x.value === "") {
            updateOutput(x, !x.dataset.notrequired);
        } else if (inputsNotCheckedByRegex.indexOf(x.type) === -1) {
            const validationExpressions = {
                email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                tel: /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?#(\d{4}|\d{3}))?$|\+[0-9]{1,3} ?[0-9 ]{1,15}/,
                date: / ^((?:(?:1[6-9]|2[0-9])\d{2})(-)(?:(?:(?:0[13578]|1[02])(-)31)|((0[1,3-9]|1[0-2])(-)(29|30))))$|^(?:(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(-)02(-)29)$|^(?:(?:1[6-9]|2[0-9])\d{2})(-)(?:(?:0[1-9])|(?:1[0-2]))(-)(?:0[1-9]|1\d|2[0-8])$/
            }
            const exp = validationExpressions[x.type]
            updateOutput(x, !exp.test(x.value))
        } else if ((x.type === "checkbox" || x.type === "radio") && x.dataset.checkrequired === "true" && !x.checked) {
            updateOutput(x)
        } else {
            updateOutput(x, false);
        }

        if (x.dataset.passwordid) {
            if (!passIds[x.dataset.passwordid]) {
                passIds[x.dataset.passwordid] = []
            }
            passIds[x.dataset.passwordid].push(x);
        }
        if (x.dataset.statename && typeaheadStates[x.dataset.statename]) {
            if (typeaheadStates[x.dataset.statename].length === 0) {
                updateOutput(x);
            }
        }
    });


    Object.keys(passIds).forEach(x => {
        if (!passIds[x].every(elm => {
            return elm.value === passIds[x][0].value;
        })) {
            updateOutput(passIds[x].slice(-1)[0]);
        } else if (!passwordRequirements.test(passIds[x][0].value)) {
            updateOutput(passIds[x][0]);
        }
    });

    if (formIsValid) {
        callBack({
            event: e,
            isValid: formIsValid,
            form: formRef.current,
            values: values,
            validInputs: validInputs,
            invalidInputs: invalidInputs
        });
    }
}

export default validateForm;