import React from 'react';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from '.';

const titleClass = 'text-2xl font-bold text-center my-4';
const thTdClass = 'text-center border border-gray-400 p-2';
const thClass = thTdClass + ' bg-blue-400 text-white';
const tdClass = thTdClass + ' bg-blue-100';

interface MistakenKeyTableProps {
  headers: string[];
  data: any[][];
  title: string;
}

export default function MistakenTable({ headers, data, title }: MistakenKeyTableProps) {
  const [translator] = useTranslation(langDict);

  // Check if the number of headers is valid (between 1 and 9)
  if (headers.length < 1 || headers.length > 9) {
    console.error('Number of headers must be between 1 and 9.');
    return null;
  }

  return (
    <div className="result-table-container">
      <h2 className={titleClass}>{title}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className={thClass}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={tdClass}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Usage Example
// <ResultTable 
//   headers={['Column 1', 'Column 2', 'Column 3']} 
//   data={[[1, 2, 3], [4, 5, 6], [7, 8, 9]]}
//   title="My Custom Table"
// />
