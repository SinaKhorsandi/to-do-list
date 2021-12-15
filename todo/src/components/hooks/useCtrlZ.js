import { useEffect, useState } from "react";

export function useCtrlZ({ onCtrlZ }) {
  function downHandler({ keyCode, ctrlKey }) {
      if (keyCode === 90 && ctrlKey) {
        onCtrlZ()
        console.log("useCrtlZ")
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  });
}
