import  Papa from "papaparse";


const readCSVFile = (file: File) => {
  return (
    Papa.parse(file, {
      complete: (result) => {
        console.log("Parsed Data:", result.data);
      },
      header: true, // Automatically extracts headers
      skipEmptyLines: true, // Ignores empty lines
      dynamicTyping: true, // Converts numeric values automatically
    })
  )
}

export default readCSVFile