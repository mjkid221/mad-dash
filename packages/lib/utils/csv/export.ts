import { unparse } from "papaparse";

export const exportData = <T>(data: T[], exportFile: string = "data.csv") => {
  const exportCsv = unparse(data);
  // Create a blob from the CSV string
  const blob = new Blob([exportCsv], { type: "text/csv;charset=utf-8;" });

  // Create a link element
  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);
  link.href = url;
  link.style.visibility = "hidden";
  link.download = exportFile;

  // Append the link to the body
  document.body.appendChild(link);

  // Trigger click on the link to start download
  link.click();

  // Clean up
  document.body.removeChild(link);
};
