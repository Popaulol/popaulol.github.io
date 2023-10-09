(() => {
    let carcassonne_variant_selector = document.getElementById("carcassonneVariant")

    function update_variant_selection() {
        if (carcassonne_variant_selector.value === "none") {
            for (let variant of document.getElementsByClassName("carcassonne_variant")) {
                variant.style.display = ""
            }
            return
        }
        let variant = document.getElementById(carcassonne_variant_selector.value)
        for (let variant of document.getElementsByClassName("carcassonne_variant")) {
            variant.style.display = "none"
        }
        variant.style.display = ""
    }

    carcassonne_variant_selector.addEventListener("change", update_variant_selection)

    update_variant_selection()

    let extension_switches = document.getElementsByClassName("extension-switch")

    function update_extension_rules() {
        for (let extension_switch of extension_switches) {
            if (extension_switch.checked) {
                for (let element of document.getElementsByClassName(extension_switch.id))
                    element.style.display = ""
                for (let element of document.getElementsByClassName("no-" + extension_switch.id))
                    element.style.display = "none"
            }
            else { for  (let element of document.getElementsByClassName(extension_switch.id))
                element.style.display = "none"
                for (let element of document.getElementsByClassName("no-" + extension_switch.id))
                    element.style.display = ""
            }

        }
    }

    for (let extension_switch of extension_switches) {
        extension_switch.addEventListener("change", update_extension_rules)
    }

    update_extension_rules()
})();
