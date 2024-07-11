import { writable } from "svelte/store"

export type ModalMessage = {
        show: boolean,
        title: string,
        message: string,
        type: string,
}

export const modalMessage = writable<ModalMessage>({
        show: false,
        title: "",
        message: "",
        type: "",
})
