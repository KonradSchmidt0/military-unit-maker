import Papa from "papaparse";
import { useEffect } from "react";
import { useIconsStore, IconEntry } from "../hooks/useIcons";

export function LoadIconsCsv(p: any) {
  const setIcons = useIconsStore(s => s.setIcons);
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/icons.csv`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch CSV');
        }
        const txt = response.text() 
        return txt;
      })
      .then((csvText) => {
        const result = Papa.parse<IconEntry>(csvText, { header: true });
        setIcons(result.data);
      })
      .catch((error) => {
        console.error('Error loading CSV:', error);
      });
  }, []);

  return null
}