import { useEffect } from "react";

export function useCtrlY({ onCtrlY }) {
    function downHandler({ keyCode, ctrlKey }) {
        if (keyCode === 89 && ctrlKey) {
            onCtrlY()
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    });
}
