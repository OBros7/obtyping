// components/Basics/MyPagination.tsx
import React from 'react';

type Props = {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  disabled?: boolean;
};

export default function MyPagination({ page, totalPages, onChange, disabled }: Props) {
  const go = (p: number) => onChange(Math.min(totalPages, Math.max(1, p)));

  const nums = (() => {
    const s = Math.max(1, page - 2);
    const e = Math.min(totalPages, page + 2);
    return Array.from({ length: e - s + 1 }, (_, i) => s + i);
  })();

  return (
    <div className="flex items-center gap-2 my-4">
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        onClick={() => go(page - 1)}
        disabled={disabled || page <= 1}
      >
        Prev
      </button>

      {nums[0] > 1 && (
        <>
          <button className="px-3 py-1 rounded border" onClick={() => go(1)} disabled={disabled}>1</button>
          {nums[0] > 2 && <span className="px-1">…</span>}
        </>
      )}

      {nums.map(n => (
        <button
          key={n}
          className={`px-3 py-1 rounded border ${n === page ? 'bg-gray-200' : ''}`}
          onClick={() => go(n)}
          disabled={disabled}
        >
          {n}
        </button>
      ))}

      {nums[nums.length - 1] < totalPages && (
        <>
          {nums[nums.length - 1] < totalPages - 1 && <span className="px-1">…</span>}
          <button className="px-3 py-1 rounded border" onClick={() => go(totalPages)} disabled={disabled}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        onClick={() => go(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}