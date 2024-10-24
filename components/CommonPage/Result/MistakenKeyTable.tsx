import React from 'react';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from '.';

const titleClass = 'text-2xl font-bold text-center my-4';
const thTdClass = 'text-center border border-gray-400 p-2';
const thClass = `${thTdClass} bg-blue-400 text-white`;
const tdClass = `${thTdClass} bg-blue-100`;

interface Column {
  header: string;
  accessor: string;
}

interface ResultTableProps {
  title: string;
  columns: Column[];
  data: { [key: string]: any }[];
}

export default function ResultTable({ title, columns, data }: ResultTableProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string];

  return (
    <>
      <div className={titleClass}>{title}</div>
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className={thClass}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.accessor} className={tdClass}>
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
