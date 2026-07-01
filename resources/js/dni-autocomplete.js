import { useCallback, useEffect, useState } from "react";

const DNI_PATTERN = /^\d{8}$/;

export async function consultaDni(dni, onStatus = () => {}) {
    const cleanDni = String(dni || "").replace(/\D/g, "").slice(0, 8);

    if (!DNI_PATTERN.test(cleanDni)) {
        return null;
    }

    onStatus("Buscando...");
    let reniecMessageTimer = null;

    try {
        reniecMessageTimer = window.setTimeout(() => {
            onStatus("Consultando RENIEC...");
        }, 400);

        const response = await window.axios.get(`/api/consulta-dni/${cleanDni}`);
        window.clearTimeout(reniecMessageTimer);
        reniecMessageTimer = null;
        const payload = response.data;

        if (payload?.found && payload.source === "database") {
            onStatus(payload.message || "Cliente encontrado.");
            return payload;
        }

        if (payload?.found && payload.source === "decolecta") {
            onStatus("Datos encontrados.");
            return payload;
        }

        onStatus(payload?.message || "No encontrado.");
        return payload;
    } catch (error) {
        onStatus(error.response?.status === 422 ? "DNI invalido." : "Error de conexion.");
        return null;
    } finally {
        if (reniecMessageTimer) {
            window.clearTimeout(reniecMessageTimer);
        }
    }
}

export function personNameFromPayload(person = {}) {
    return person.nombre_completo || person.full_name || [
        person.nombres,
        person.apellido_paterno,
        person.apellido_materno,
    ].filter(Boolean).join(" ");
}

export function useDniAutocomplete({ data, setData, targetField = "full_name", onFound = null }) {
    const [dniStatus, setDniStatus] = useState("");
    const [dniLoading, setDniLoading] = useState(false);

    const fillPerson = useCallback((person) => {
        const nombreCompleto = personNameFromPayload(person);

        setData({
            ...data,
            dni: person.dni || data.dni,
            nombres: person.nombres || data.nombres || "",
            apellido_paterno: person.apellido_paterno || data.apellido_paterno || "",
            apellido_materno: person.apellido_materno || data.apellido_materno || "",
            [targetField]: nombreCompleto || data[targetField] || "",
        });

        if (typeof onFound === "function") {
            onFound(person);
        }
    }, [data, onFound, setData, targetField]);

    const handleDniChange = useCallback(async (event) => {
        const cleanDni = event.target.value.replace(/\D/g, "").slice(0, 8);
        setData("dni", cleanDni);

        if (cleanDni.length !== 8) {
            setDniStatus("");
            return;
        }

        setDniLoading(true);
        const payload = await consultaDni(cleanDni, setDniStatus);
        setDniLoading(false);

        if (payload?.found && payload.person) {
            fillPerson(payload.person);
        }
    }, [fillPerson, setData]);

    return {
        dniStatus,
        dniLoading,
        handleDniChange,
    };
}

function setInputValue(form, names, value) {
    const input = names
        .map((name) => form.querySelector(`[name="${name}"]`))
        .find(Boolean);

    if (!input || value === undefined || value === null || value === "") {
        return;
    }

    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
}

export function bootDniAutocomplete() {
    document.addEventListener("input", async (event) => {
        const input = event.target;

        if (!(input instanceof HTMLInputElement) || !input.classList.contains("dni-autocomplete")) {
            return;
        }

        const cleanDni = input.value.replace(/\D/g, "").slice(0, 8);
        input.value = cleanDni;

        if (cleanDni.length !== 8 || input.dataset.dniAutocompleteLast === cleanDni) {
            return;
        }

        input.dataset.dniAutocompleteLast = cleanDni;
        const form = input.closest("form") || document;
        const payload = await consultaDni(cleanDni, (message) => {
            input.dispatchEvent(new CustomEvent("dni-autocomplete:status", {
                bubbles: true,
                detail: { message },
            }));
        });

        if (!payload?.found || !payload.person) {
            return;
        }

        const person = payload.person;
        setInputValue(form, ["dni"], person.dni);
        setInputValue(form, ["nombres"], person.nombres);
        setInputValue(form, ["apellido_paterno"], person.apellido_paterno);
        setInputValue(form, ["apellido_materno"], person.apellido_materno);
        setInputValue(form, ["nombre_completo", "full_name", "client_name", "name"], personNameFromPayload(person));
    });
}
